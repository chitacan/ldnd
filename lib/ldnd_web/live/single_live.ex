defmodule LdndWeb.SingleLive do
  use LdndWeb, :live_view

  def mount(_arg0, _session, socket) do
    {:ok, socket}
  end

  def render(assigns) do
    ~H"""
    <div>single target</div>
    <div id="single-target" phx-hook="SingleTarget">
    <div><div><div role="Dustbin" class="w-40 h-40 m-6 p-4 text-base text-white" style="background-color:#222">Drag a box here</div></div><div><div role="Box" class="border border-dashed border-gray-400 m-2 p-1 w-min cursor-move" style="opacity:1" data-testid="box-Glass">Glass</div><div role="Box" class="border border-dashed border-gray-400 m-2 p-1 w-min cursor-move" style="opacity:1" data-testid="box-Banana">Banana</div><div role="Box" class="border border-dashed border-gray-400 m-2 p-1 w-min cursor-move" style="opacity:1" data-testid="box-Paper">Paper</div></div></div>
    </div>
    """
  end
end
