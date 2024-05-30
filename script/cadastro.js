document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.cadastro_forms');
    const emailInput = document.querySelector('#exampleInputEmail1');
    const passwordInput = document.querySelector('#exampleInputPassword1');
    const registerButton = document.querySelector('.btn-primary');

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

    registerButton.addEventListener('click', async function (event) {
        event.preventDefault();

        clearErrorMessages();

        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password) {
            displayErrorMessage(form, 'Por favor, preencha todos os campos.');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            displayErrorMessage(emailInput, 'Por favor, insira um email válido.');
            emailInput.focus();
            return;
        }

        if (password.length < 6) {
            displayErrorMessage(passwordInput, 'A senha deve ter pelo menos 6 caracteres.');
            passwordInput.focus();
            return;
        }

        const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{6,}$/;
        if (!passwordPattern.test(password)) {
            displayErrorMessage(passwordInput, 'A senha deve ter pelo menos uma letra maiúscula, um caractere especial e um número.');
            passwordInput.focus();
            return;
        }

        try {
            const emailCheckResponse = await fetch('http://localhost:8080/auth/check-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            });

            const emailCheckResult = await emailCheckResponse.json();

            if (!emailCheckResult.available) {
                displayErrorMessage(emailInput, 'Este email já está cadastrado. Por favor, use outro email.');
                emailInput.focus();
                return;
            }
        } catch (error) {
            console.error('Erro na verificação de email:', error);
            displayErrorMessage(form, 'Erro ao verificar o email. Tente novamente.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login: email,
                    password: password,
                    role: 'ADMIN'
                })
            });

            if (response.ok) {
                displayErrorMessage(form, 'Cadastro realizado com sucesso!', 'success');
                setTimeout(() => {
                    window.location.href = './login.html';
                }, 2000);
            } else {
                displayErrorMessage(form, 'Erro no cadastro. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro:', error);
            displayErrorMessage(form, 'Erro no cadastro. Tente novamente.');
        }
    });
});
