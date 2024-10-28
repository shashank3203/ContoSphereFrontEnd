let currentlyEditing = null;

document.addEventListener('DOMContentLoaded', () => {
    updateIcons(); // Update icons on page load
});

function showSuccessMessage(event) {
    event.preventDefault(); // Prevent default form submission

    const form = document.getElementById('contactForm');
    const errorMessages = []; // Array to collect error messages

    // Validate required fields
    const requiredFields = [
        { id: 'name', name: 'Name' },
        { id: 'email', name: 'Email' },
        { id: 'phonenumber', name: 'Phone Number' },
        { id: 'address', name: 'Address' },
        { id: 'description', name: 'Description' },
    ];

    requiredFields.forEach(field => {
        const input = document.getElementById(field.id);
        if (!input.value) {
            errorMessages.push(`${field.name} is required.`);
        }
    });

    // Validate email format
    const email = document.getElementById('email').value;
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (email && !emailPattern.test(email)) {
        errorMessages.push('Please enter a valid email address.');
    }

    // If there are errors, display them
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.innerHTML = ''; // Clear previous errors

    if (errorMessages.length > 0) {
        errorMessages.forEach(msg => {
            const errorElement = document.createElement('div');
            errorElement.className = '#FFFFFF';
            errorElement.textContent = msg;
            errorContainer.appendChild(errorElement);
        });
        errorContainer.style.display = 'block'; // Show error messages
        return; // Prevent form submission
    }

    // If no errors, proceed with form submission
    fetch(form.action, {
        method: 'POST',
        body: new FormData(form)
    })
    .then(response => {
        if (response.ok) {
            // Show the success message
            const successMessage = document.getElementById('successMessage');
            successMessage.style.display = 'block';

            // Hide the success message after a delay
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);

            // Set all fields to readonly after saving
            setAllFieldsReadOnly();
        } else {
            console.error('Update failed:', response);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function toggleEdit(fieldId) {
    const inputField = document.getElementById(fieldId);
    const isEditable = inputField.hasAttribute('readonly');

    // Toggle the readonly attribute
    if (isEditable) {
        inputField.removeAttribute('readonly');
        inputField.focus(); // Focus on the input field
        currentlyEditing = fieldId; // Set the currently editing field
    } else {
        inputField.setAttribute('readonly', true);
        currentlyEditing = null; // Reset the currently editing field
        updateIcons(); // Update icons when done editing
    }

    // Hide the pencil icon if the input field loses focus
    inputField.onblur = () => {
        if (currentlyEditing !== null) {
            inputField.setAttribute('readonly', true);
            currentlyEditing = null; // Reset the currently editing field
            updateIcons(); // Update icons when focus is lost
        }
    };
}

function updateIcons() {
    const websiteLink = document.getElementById('websiteLink').value;
    const linkedinLink = document.getElementById('LinkedInLink').value;

    const websiteIcon = document.getElementById('websiteIcon');
    const linkedinIcon = document.getElementById('linkedinIcon');

    if (websiteLink) {
        websiteIcon.href = websiteLink; // Set the href for the website icon
        websiteIcon.style.display = 'inline'; // Show the icon
    } else {
        websiteIcon.style.display = 'none'; // Hide the icon if no link
    }

    if (linkedinLink) {
        linkedinIcon.href = linkedinLink; // Set the href for the LinkedIn icon
        linkedinIcon.style.display = 'inline'; // Show the icon
    } else {
        linkedinIcon.style.display = 'none'; // Hide the icon if no link
    }
}

function setAllFieldsReadOnly() {
    const fields = ['name', 'email', 'phonenumber', 'address', 'description', 'websiteLink', 'LinkedInLink', 'socialLink'];
    fields.forEach(fieldId => {
        const inputField = document.getElementById(fieldId);
        inputField.setAttribute('readonly', true);
    });
}

function addSocialLink() {
    const socialLinkInput = document.getElementById('socialLink');
    const newLink = socialLinkInput.value;

    if (newLink) {
        // Create a new input field for the social link
        const newSocialLinkGroup = document.createElement('div');
        newSocialLinkGroup.className = 'form-row social-link-group';
        newSocialLinkGroup.innerHTML = `
            <div class="col">
                <input type="url" value="${newLink}" readonly placeholder="Enter social link" />
                <i class="fas fa-pencil-alt pencil-icon" onclick="toggleEdit('newSocialLink${Date.now()}')"></i>
                <i class="fas fa-check tick-icon" onclick="addSocialLink()"></i>
            </div>
        `;
        document.querySelector('.social-links').appendChild(newSocialLinkGroup);
        socialLinkInput.value = ''; // Clear the input field
    }
}
