window.onload = function () {
  // Get user ID from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user._id : null;

  if (!user) {
    window.location.href = "/signin";
  }

  document
    .getElementById("changePasswordForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const oldPassword = document.getElementById("oldPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (!userId) {
        alert("User not found");
        return;
      }

      fetch("/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: userId,
          oldPassword,
          newPassword,
          confirmPassword,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          if (data.message === "Password updated successfully") {
            window.location.href = "/dashboard";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
};
