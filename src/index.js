$(document).ready(function() {
$("#loginForm").submit(async function(event) {
    event.preventDefault();

    // Get form data
    const formData = {
        name: $("#loginName").val(),
        password: $("#loginPassword").val()
    };

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            // Redirect to todo route after successful login
            window.location.href = "/todo.hbs";
        } else {
            // Handle failed login attempts
            console.error("Login failed:", response.statusText);
            alert("Invalid credentials. Please try again.");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("Error during login. Please try again.");
    }
});

$("#signupForm").submit(async function(event) {
        event.preventDefault();

        // Get form data
        const formData = {
            name: $("#signupName").val(),
            password: $("#signupPassword").val()
        };

        try {
            const response = await fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Redirect to todo route after successful signup
                window.location.href = "/todo.hbs";
            } else {
                // Handle failed signup attempts
                console.error("Signup failed:", response.statusText);
                alert("Signup failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during signup:", error);
            alert("Error during signup. Please try again.");
        }
    });
})

window.onload = () => {
  const form = document.querySelector("#todo-list");
  const taskInput = document.getElementById("task-list-input");
  const dueDateInput = document.getElementById("due-date-input");
  const taskList = document.getElementById("tasks-container");

  form.addEventListener("submit", async function(event) {
      event.preventDefault();

      const taskDescription = taskInput.value.trim();
      const taskDueDate = dueDateInput.value;
    
      try {
          let taskId = taskInput.getAttribute("data-task-id");
          let method = "POST";
          let endpoint = "/todo.hbs";
          if (taskId) {
              method = "PUT";
              endpoint = `/todo.hbs/${taskId}`;
          }

          const response = await fetch(endpoint, {
              method: method,
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                  description: taskDescription,
                  dueDate: taskDueDate
              })
          })

          if (response.ok) {
              const data = await response.json();
              console.log("Parsed JSON data:", data);
              if (taskId) {
                  const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
                  taskElement.querySelector(".text").value = taskDescription;
                  taskInput.removeAttribute("data-task-id");
              } else {
                  addItemToDOM(data);
              }
              taskInput.value = "";
          } else {
              console.error("Error creating/updating task:", response.statusText);
              alert("Error creating/updating task. Please try again.");
          }
      } catch (error) {
          console.error("Error creating/updating task:", error);
          alert("Error creating/updating task. Please try again.");
      }
  });

  // Function to add item to the DOM
  function addItemToDOM(data) {
      const taskElement = document.createElement("li");
      taskElement.className = "tasks";
      taskElement.dataset.taskId = data._id;

      const contentDiv = document.createElement("div");
      contentDiv.className = "content";

      const input = document.createElement("input");
      input.type = "text";
      input.className = "text";
      input.value = data.description;
      input.readOnly = true;

      contentDiv.appendChild(input);

      const actionsDiv = document.createElement("div");
      actionsDiv.className = "actions";

      const editButton = document.createElement("button");
      editButton.className = "edit-task";
      editButton.appendChild(document.createTextNode("Edit"));

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-task";
      deleteButton.appendChild(document.createTextNode("Delete"));

      actionsDiv.appendChild(editButton);
      actionsDiv.appendChild(deleteButton);

      taskElement.appendChild(contentDiv);
      taskElement.appendChild(actionsDiv);

      taskList.appendChild(taskElement);

      editButton.addEventListener("click", handleEditTask);
      deleteButton.addEventListener("click", handleDelete);
  }
}
