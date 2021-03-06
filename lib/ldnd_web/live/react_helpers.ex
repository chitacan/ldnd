defmodule LdndWeb.LiveView.ReactHelpers do
  defmacro __using__(container_name: container_name) do
    bundle_path =
      Mix.Project.build_path()
      |> Path.join("assets")

    container_file = container_name <> ".jsx"
    container_path = Path.join(["js", "containers", container_file])

    bundle_file = bundle_path |> Path.join(container_file |> Path.rootname() |> Path.basename())

    assets_path = Path.expand("../../../assets", __DIR__)
    execute_esbuild(:react, [container_path, "--outdir=#{bundle_path}"])

    # TODO: should allow passing props to container
    render_code = """
      const {renderToString} = require("react-dom/server");
      const {createElement} = require("react");
      const Component = require("#{bundle_file}");
      const html = renderToString(createElement(Component.default, {socket: {}}));
      process.stdout.write(html);
      process.exit(0);
    """

    # TODO: should handle error case
    component =
      System.find_executable("node")
      |> System.cmd(["--eval", render_code],
        cd: assets_path,
        env: %{"NODE_PATH" => Path.join(assets_path, "node_modules")},
        into: "",
        stderr_to_stdout: true
      )
      |> elem(0)
      |> hook_component(container_name)

    Module.put_attribute(
      __CALLER__.module,
      :external_resource,
      Path.join(["assets", container_path])
    )

    quote do
      def render_react(assigns) do
        # from https://github.com/phoenixframework/phoenix_live_view/blob/cb6ebc1e/lib/phoenix_live_view/helpers.ex#L155-L165
        {result, _bindings} =
          unquote(component)
          |> EEx.compile_string(engine: Phoenix.LiveView.HTMLEngine)
          |> Code.eval_quoted(assigns: assigns)

        result
      end
    end
  end

  defp hook_component(html, component) do
    """
    <div id="#{component}" phx-hook="__react" phx-update="ignore">#{html}</div>
    """
  end

  defp execute_esbuild(profile, extra_args) when is_atom(profile) and is_list(extra_args) do
    # unless File.exists?(Esbuild.bin_path()) do
    #   Esbuild.install()
    # end

    config = Esbuild.config_for!(profile)
    args = config[:args] || []

    opts = [
      cd: config[:cd] || File.cwd!(),
      env: config[:env] || %{},
      into: "",
      stderr_to_stdout: true
    ]

    Esbuild.bin_path()
    |> System.cmd(args ++ extra_args, opts)
    |> elem(0)
  end
end
