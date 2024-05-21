window.onload = function () {
  document.getElementById("signupForm").onsubmit = async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      alert(data.message);

      if (response.status === 201) {
        window.location.href = "/"; // Navigate to home page
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };
};
