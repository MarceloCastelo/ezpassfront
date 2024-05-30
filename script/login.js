document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.login_forms');
    const emailInput = document.querySelector('#exampleInputEmail1');
    const passwordInput = document.querySelector('#exampleInputPassword1');
    const loginButton = document.querySelector('.btn-primary');

    function clearErrorMessages() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(function (msg) {
            msg.remove();
        });
    }

    function displayErrorMessage(inputElement, message) {
        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-message';
        errorMessage.style.color = 'red';
        errorMessage.textContent = message;
        inputElement.parentElement.appendChild(errorMessage);
    }

    loginButton.addEventListener('click', async function (event) {
        event.preventDefault();

        clearErrorMessages();

        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password) {
            displayErrorMessage(form, 'Por favor, preencha todos os campos.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login: email,
                    password: password
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(form, 'Login realizado com sucesso!', 'success');
                setTimeout(() => {
                    window.location.href = './home.html'; // Redirect to home page
                }, 2000);
            } else {
                displayErrorMessage(form, 'Erro no login. Verifique suas credenciais e tente novamente.');
            }
        } catch (error) {
            console.error('Erro:', error);
            displayErrorMessage(form, 'Erro no login. Tente novamente.');
        }
    });
});
