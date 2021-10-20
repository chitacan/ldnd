defmodule LdndWeb.LiveView.Helpers do
  import Phoenix.HTML

  defmacro render_react(container_path, container_name) do
    assets_path = Path.expand("../../../assets", __DIR__)
    bundle = execute_esbuild(:react, [container_path])

    render_code = """
      const {renderToString} = require("react-dom/server");
      const {createElement} = require("react");
      const html = renderToString(createElement(#{container_name}));
      process.stdout.write(html);
    """

    component =
      System.find_executable("node")
      |> System.cmd(["--eval", bundle <> render_code],
        cd: assets_path,
        env: %{"NODE_PATH" => Path.join(assets_path, "node_modules")}
      )
      |> elem(0)
      |> hook_component(container_name)

    quote do
      raw(unquote(component))
    end
  end

  defp hook_component(html, component) do
    """
    <div id="#{component}" phx-hook="__react">#{html}</div>
    """
  end

  defp execute_esbuild(profile, extra_args) when is_atom(profile) and is_list(extra_args) do
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
