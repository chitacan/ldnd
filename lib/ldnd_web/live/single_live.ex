defmodule LdndWeb.SingleLive do
  use LdndWeb, :live_view

  def mount(_arg0, _session, socket) do
    {:ok, assign(socket, :dropped, nil)}
  end

  def handle_event("dropped", %{"item" => %{"name" => name}}, socket) do
    {:reply, %{"status" => "ok"}, assign(socket, :dropped, name)}
  end

  def handle_event("change_boxes", _, socket) do
    count = Enum.random([3, 4, 5])

    boxes =
      Enum.take_random(["Glass", "Banana", "Paper", "Dog", "Wolf", "Savage", "Teddy"], count)

    {:noreply, socket |> push_event("boxes", %{"data" => boxes})}
  end

  def render(assigns) do
    ~H"""
    <h2 class="text-2xl font-bold">single target</h2>
    <div>
      <button
        class="p-2 my-2 bg-gray-200 hover:bg-gray-300"
        phx-click="change_boxes">random boxes</button>
      <%= if @dropped != nil do %>
        <span class="ml-2 text-green-700">dropped ➡️ <%= @dropped %></span>
      <% end %>
    </div>
    <%= render_react "js/containers/single_target.jsx", "SingleTarget" %>
    """
  end
end
