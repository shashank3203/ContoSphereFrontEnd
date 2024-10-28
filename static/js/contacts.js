const baseUrl = "http://localhost:8080"

function openModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Hide scrollbar when modal is open
}

// Close modal logic remains the same
const span = document.getElementsByClassName("close")[0];
span.onclick = function() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById("myModal");
    if (event.target == modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // Restore scrollbar
    }
}

async function loadContactData(id) {
// Get contact data
console.log(id)
try{
// fetch contact data function
const data = await(
await fetch(`${baseUrl}/api/contacts/${id}`)
).json();
console.log(data);

document.querySelector("#contact_name").innerHTML = data.name;
document.querySelector("#contact_email").innerHTML = data.email;
document.querySelector("#contact_image").src = data.picture;
document.querySelector("#contact_phone").innerHTML = data.phoneNumber;
document.querySelector("#contact_description").innerHTML = data.description;
document.querySelector("#contact_address").innerHTML = data.address;
openModal();
}catch(error){
    console.log(error);
}
}

// Copyable contact
document.addEventListener('DOMContentLoaded', function() {
    const copyableItems = document.querySelectorAll('.copyable');
    const copyMessage = document.getElementById('copyMessage');

    copyableItems.forEach(item => {
        item.addEventListener('click', function() {
            const textToCopy = this.textContent; // Get the text of the clicked item

            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    copyMessage.style.display = 'block'; // Show the copied message
                    setTimeout(() => {
                        copyMessage.style.display = 'none'; // Hide it after 2 seconds
                    }, 2000);
                })
                .catch(err => {
                    console.error('Error copying text: ', err);
                });
        });
    });
});

async function deleteContact(id) {
  Swal.fire({
    title: "Do you want to save the changes?",
    icon: "warning",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Delete",
    denyButtonText: `Don't Delete`,
    customClass: {
      confirmButton: 'btn-delete', // Class for the delete button
      denyButton: 'btn-deny', // Class for the don't delete button
    },
    background: '#333', // Dark theme background
    color: '#fff', // Light text color
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: "The contact has been successfully deleted.",
        icon: "success",
        background: '#333', // Dark theme background
        color: '#fff', // Light text color
      }).then(() => {
        const url = `${baseUrl}/user/contact/delete?contactId=` + id;
        window.location.replace(url);
      });
    } else if (result.isDenied) {
      Swal.fire({
        title: "Changes are not saved",
        icon: "info",
        background: '#333', // Dark theme background
        color: '#fff', // Light text color
      });
    }
  });
}

// Add this CSS to style the buttons
const style = document.createElement('style');
style.innerHTML = `
  .btn-delete {
    background-color: red !important; /* Red background for delete button */
    color: white !important; /* White text color */
  }
  .btn-deny {
    background-color: orange !important; /* Change to your preferred color */
    color: white !important; /* White text color */
  }
`;
document.head.appendChild(style);

