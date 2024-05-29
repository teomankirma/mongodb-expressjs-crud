window.onload = function () {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) window.location.href = "/dashboard"; // Redirect to dashboard page

  document.getElementById("signinForm").onsubmit = async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/dashboard"; // Navigate to dashboard page
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };
};
