defmodule LdndWeb.SingleLive do
  use LdndWeb, :live_view

  def mount(_arg0, _session, socket) do
    {:ok, socket}
  end

  def render(assigns) do
    ~H"""
    <div>single target</div>
    <div id="single-target" phx-hook="SingleTarget"></div>
    """
  end
end
