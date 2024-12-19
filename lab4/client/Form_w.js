document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("surveyForm");
    const thankYouMessage = document.querySelector(".thank-you");

    const nameInput = document.getElementById("name");
    const nameError = document.getElementById("nameError");
    const questionGroups = document.querySelectorAll(".question");
    const ageInput = document.getElementById("age");
    const today = new Date().toISOString().split("T")[0];
    ageInput.setAttribute("max", today);

    const ageError = document.getElementById("ageError");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        let isValid = true;
        const nameRegex = /^[А-ЯЁа-яё]+$/u;
        const answers = [];

        //Проверка даты
        const ageValue = ageInput.value;
        if (!isValidDate(ageValue)) {
            event.preventDefault();
            ageError.textContent = "Пожалуйста, введите корректную дату.";
            ageError.style.display = "block";
        }


        // Проверка имени
         if (!nameRegex.test(nameInput.value.trim())) {
             nameError.textContent = "Имя должно содержать только русские буквы.";
             nameError.style.display = "block";
             isValid = false;
         } else {
             nameError.style.display = "none";
         }

        // Проверка вопросов
        questionGroups.forEach((group, index) => {
            const radios = group.querySelectorAll("input[type='radio']");
            const questionError = group.querySelector(".question-error");
            const selected = Array.from(radios).find(radio => radio.checked);

            if (!selected) {
                questionError.textContent = `Выберите хотя бы один вариант для вопроса ${index + 1}.`;
                questionError.style.display = "block";
                isValid = false;
            } else {
                questionError.style.display = "none";
                // Добавляем выбранный ответ в массив
                answers.push({ question: `Вопрос ${index + 1}`, answer: parseInt(selected.value, 10) });
            }
        });


        if (isValid) {
             try {
                // Асинхронная отправка данных на сервер
                const response = await fetch('http://localhost:3000/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: nameInput.value.trim(),
                        age: document.getElementById("age").value,
                        answers: answers,
                    }),
                });
                if (!response.ok) {
                    throw new Error("Ошибка при отправке данных на сервер");
                }

                const result = await response.json();
                console.log("Результат от сервера:", result);

                // Показать сообщение благодарности
                form.style.display = "none";
                thankYouMessage.style.display = "block";

                 const houseMessage = document.getElementById("otv_house");
                 houseMessage.textContent = `${result.house}`;

                window.scrollTo({ top: 0, behavior: "smooth" });
             } catch (error) {
                 console.error("Ошибка:", error.message);
                 alert("Произошла ошибка при отправке данных. Попробуйте позже.");
             }
        }
    });

    function isValidDate(dateString) {

        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (!datePattern.test(dateString)) {
            return false;
        }


        const [year, month, day] = dateString.split("-").map(Number);


        if (year < 1900 || month < 1 || month > 12 || day < 1 || day > 31) {
            return false;
        }


        const date = new Date(year, month - 1, day);


        return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
        );
    }
});

