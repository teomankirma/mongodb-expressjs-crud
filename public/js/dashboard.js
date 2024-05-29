window.onload = function () {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    document.getElementById("username").textContent = user.username;
  } else {
    window.location.href = "/signin"; // Redirect to sign-in page
  }

  // Render reservations
  const reservationsList = document.getElementById("reservations");

  if (user && user.reservations.length > 0) {
    user.reservations.forEach((reservation) => {
      const listItem = document.createElement("li");
      const ticketTypeElement = document.createElement("p");
      ticketTypeElement.textContent = `Ticket Type: ${reservation.ticketType}`;
      const dateElement = document.createElement("p");
      dateElement.textContent = `Date: ${reservation.date}`;
      const peopleElement = document.createElement("p");
      peopleElement.textContent = `People: ${reservation.people}`;
      const priceElement = document.createElement("p");
      priceElement.textContent = `Price: $${reservation.price}`;

      const cancelButton = document.createElement("button");
      cancelButton.textContent = "Cancel Reservation";
      cancelButton.id = reservation._id;
      cancelButton.onclick = cancelReservation;

      listItem.appendChild(ticketTypeElement);
      listItem.appendChild(dateElement);
      listItem.appendChild(peopleElement);
      listItem.appendChild(priceElement);
      listItem.appendChild(cancelButton);

      reservationsList.appendChild(listItem);
    });
  } else {
    const listItem = document.createElement("p");
    listItem.textContent = "You don't have any reservations.";
    reservationsList.appendChild(listItem);
  }
};

// Cancel reservation function
const cancelReservation = async (event) => {
  const reservationId = event.target.id;

  // Get the user object from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Confirm with the user before deleting the reservation
  const confirmDelete = confirm(
    "Are you sure you want to cancel this reservation?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch(`/delete-reservation/${reservationId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user._id }),
    });

    if (!response.ok) {
      throw new Error("Failed to cancel reservation");
    }

    // Update the user object in localStorage
    const reservationIndex = user.reservations.findIndex(
      (reservation) => reservation._id === reservationId
    );
    user.reservations.splice(reservationIndex, 1);
    localStorage.setItem("user", JSON.stringify(user));

    alert("Reservation cancelled successfully");
    location.reload();
  } catch (error) {
    console.error("Error:", error);
  }
};

// Sign out function
const signOut = () => {
  const confirmation = confirm("Do you really want to sign out?");

  if (confirmation) {
    localStorage.removeItem("user");
    window.location.href = "/"; // Redirect to home page
  }
};