let ticketTypesData = [];

window.onload = function () {
  // Set the min attribute of the date input field to the current date
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  document
    .getElementById("date")
    .setAttribute("min", today.toISOString().split("T")[0]);

  document.getElementById("expiry-year").setAttribute("min", currentYear);

  const expiryYearInput = document.getElementById("expiry-year");
  const expiryMonthInput = document.getElementById("expiry-month");

  expiryYearInput.addEventListener("change", validateExpiryDate);
  expiryMonthInput.addEventListener("change", validateExpiryDate);

  function validateExpiryDate() {
    if (parseInt(expiryYearInput.value, 10) === currentYear) {
      expiryMonthInput.setAttribute("min", currentMonth);
    }
  }

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) window.location.href = "/signin"; // Redirect to signin page if user doesn't exists

  // Get the select element
  const select = document.getElementById("ticket-type");

  // Fetch ticket types from the server
  fetch("/ticket-types")
    .then((response) => response.json())
    .then((ticketTypes) => {
      ticketTypesData = ticketTypes;

      // For each ticket type
      ticketTypes.forEach((ticketType) => {
        // Create a new option element
        const option = document.createElement("option");

        option.id = ticketType._id;
        option.value = ticketType.type;
        option.textContent = ticketType.type;

        select.appendChild(option);
      });
    })
    .catch((error) => console.error("Error:", error));

  // Get the form element
  const form = document.getElementById("newReservationForm");

  // Add an event listener to the form
  form.addEventListener("submit", function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the values from the form
    const ticketType = document.getElementById("ticket-type").value;
    const date = document.getElementById("date").value;
    const people = document.getElementById("people").value;
    const priceText = document.getElementById("price").textContent;
    const price = priceText
      ? parseFloat(priceText.replace("Total Price: $", ""))
      : 0;
    const saveCard = document.getElementById("save-card").checked;
    const cardName = document.getElementById("card-name").value;
    const cardNumber = document.getElementById("card-number").value;
    const expiryMonth = document.getElementById("expiry-month").value;
    const expiryYear = document.getElementById("expiry-year").value;
    const securityCode = document.getElementById("security-code").value;

    // Create the body object
    const body = {
      userId: user._id,
      ticketType,
      date,
      people,
      price,
      saveCard,
      cardName,
      cardNumber,
      expiryMonth,
      expiryYear,
      securityCode,
    };

    // Send a POST request to the server
    fetch("/new-reservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          // Update the user object in localStorage
          user.reservations.push({
            ticketType,
            date,
            people,
            price,
            _id: data._id,
          });

          localStorage.setItem("user", JSON.stringify(user));

          alert("Reservation added successfully");
          window.location.href = "/dashboard"; // Redirect to dashboard page
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  const ticketTypeSelect = document.getElementById("ticket-type");
  ticketTypeSelect.addEventListener("change", updatePrice);

  ticketTypeSelect.addEventListener("change", function () {
    const selectedTicketType = ticketTypesData.find(
      (t) => t._id === ticketTypeSelect.selectedOptions[0].id
    );
    document.getElementById("ticket-type-description").textContent =
      selectedTicketType.description;
    document.getElementById(
      "single-ticket-price"
    ).textContent = `(A single ticket price is $${selectedTicketType.basePrice}.)`;
  });

  const peopleInput = document.getElementById("people");
  peopleInput.addEventListener("input", updatePrice);

  function updatePrice() {
    const ticketType = document.getElementById("ticket-type");
    const ticketTypeId = ticketType.selectedOptions[0].id;
    const people = peopleInput.value;

    if (ticketType.value && people > 0) {
      const selectedTicketType = ticketTypesData.find(
        (t) => t._id === ticketTypeId
      );
      const price = selectedTicketType.basePrice * people;
      document.getElementById("price").textContent = `Total Price: $${price}`;
    } else {
      document.getElementById("price").textContent = "";
    }
  }

  const goToPaymentButton = document.querySelector("#go-to-payment");
  const reservationInfo = document.querySelector(".reservation-info");
  const paymentInfo = document.querySelector(".payment-info");

  goToPaymentButton.addEventListener("click", async function (e) {
    e.preventDefault();
    const fields = reservationInfo.querySelectorAll("input, select");

    // Check if all fields are valid
    let allFieldsValid = true;
    for (let i = 0; i < fields.length; i++) {
      if (!fields[i].checkValidity()) {
        allFieldsValid = false;
        // Trigger the validation message
        fields[i].reportValidity();
        break;
      }
    }

    // If all fields are valid, add and remove the classes
    if (allFieldsValid) {
      await fetch(`/saved-credit-cards/${user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const cardContainer = document.getElementById("card-container");

          if (data.length === 0) {
            cardContainer.innerHTML = "You don't have any saved cards";
          } else {
            const cardHtml = data
              .map(
                (card, index) => `
              <div class="card">
                <input type="radio" id="card${index}" name="card" value="${
                  card._id
                }">
                <label for="card${index}">${
                  card.cardName
                } - **** **** **** ${card.cardNumber.slice(-4)}</label>
              </div>
            `
              )
              .join("");

            cardContainer.innerHTML = cardHtml;

            data.forEach((card, index) => {
              const radioButton = document.getElementById(`card${index}`);
              radioButton.setAttribute("data-checked", "no");

              radioButton.addEventListener("click", function () {
                if (this.getAttribute("data-checked") === "yes") {
                  this.checked = false;
                  this.setAttribute("data-checked", "no");
                } else {
                  this.setAttribute("data-checked", "yes");
                }

                // Uncheck all other radio buttons
                data.forEach((otherCard, otherIndex) => {
                  if (otherIndex !== index) {
                    const otherRadioButton = document.getElementById(
                      `card${otherIndex}`
                    );
                    otherRadioButton.setAttribute("data-checked", "no");
                  }
                });
                const formElements = [
                  document.getElementById("card-number"),
                  document.getElementById("expiry-month"),
                  document.getElementById("expiry-year"),
                  document.getElementById("security-code"),
                  document.getElementById("save-card"),
                  document.getElementById("card-name"),
                ];
                formElements.forEach((element) => {
                  if (element) {
                    element.disabled = this.checked;
                  }
                });
                formElements.forEach((element) => {
                  if (element) {
                    element.value = "";
                  }
                });
              });
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      reservationInfo.classList.add("hidden");
      paymentInfo.classList.remove("hidden");
    }
  });

  const goBackButton = document.querySelector("#go-back");

  goBackButton.addEventListener("click", function (e) {
    e.preventDefault();
    reservationInfo.classList.remove("hidden");
    paymentInfo.classList.add("hidden");
  });

  const saveCardCheckbox = document.getElementById("save-card");
  const cardNameLabel = document.querySelector('label[for="card-name"]');
  const cardNameInput = document.getElementById("card-name");

  saveCardCheckbox.addEventListener("change", function () {
    if (saveCardCheckbox.checked) {
      cardNameLabel.classList.remove("hidden");
      cardNameInput.classList.remove("hidden");
    } else {
      cardNameLabel.classList.add("hidden");
      cardNameInput.classList.add("hidden");
    }
  });
};
