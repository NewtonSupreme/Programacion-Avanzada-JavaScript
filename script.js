    
    /* 
    Script principal para la aplicación de gestión de tareas, citas de anime, conversor de divisas y cuestionario.
    Por: Leandro Marquez. 
    Para: Programación V - UBA
    */
 
        // Variables globales
        const modules = {
            tasks: {
                tasks: JSON.parse(localStorage.getItem('tasks')) || [],
                currentFilter: 'all'
            },
            quotes: {
                savedQuotes: JSON.parse(localStorage.getItem('savedQuotes')) || []
            },
            quiz: {
                questions: [],
                currentQuestionIndex: 0,
                score: 0,
                answered: false
            },
            currency: {
                rates: {},
                chart: null
            }
        };

        // Inicialización de la aplicación
        document.addEventListener('DOMContentLoaded', () => {
            // Inicializar módulos
            initTaskManager();
            initQuoteGenerator();
            initCurrencyConverter();
            initQuizApp();
            
            // Configurar navegación
            setupNavigation();
            
            // Cargar datos iniciales
            loadInitialData();
            
            // Mostrar módulo activo
            showActiveModule();
        });

        // Configurar navegación entre módulos
        function setupNavigation() {
            const navButtons = document.querySelectorAll('.nav-btn');
            
            navButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Quitar clase activa de todos los botones
                    navButtons.forEach(btn => btn.classList.remove('active'));
                    
                    // Añadir clase activa al botón clickeado
                    button.classList.add('active');
                    
                    // Mostrar el módulo correspondiente
                    const moduleId = button.dataset.module;
                    showModule(moduleId);
                });
            });
        }

        // Mostrar módulo específico
        function showModule(moduleId) {
            // Ocultar todos los módulos
            document.querySelectorAll('.module').forEach(module => {
                module.classList.remove('active');
            });
            
            // Mostrar el módulo seleccionado
            document.getElementById(`${moduleId}-module`).classList.add('active');
        }

        // Mostrar módulo activo al cargar
        function showActiveModule() {
            const activeModule = document.querySelector('.nav-btn.active').dataset.module;
            showModule(activeModule);
        }

        // ==========================================
        // MÓDULO 1: GESTOR DE TAREAS
        // ==========================================
        function initTaskManager() {
            const taskInput = document.getElementById('taskInput');
            const addTaskBtn = document.getElementById('addTaskBtn');
            const filterButtons = document.querySelectorAll('.filter-btn');
            const taskList = document.getElementById('taskList');
            
            // Event listeners
            addTaskBtn.addEventListener('click', addTask);
            taskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') addTask();
            });
            
            filterButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    modules.tasks.currentFilter = btn.dataset.filter;
                    renderTasks();
                });
            });
            
            // Renderizar tareas iniciales
            renderTasks();
            updateTaskStats();
        }

        function addTask() {
            const taskInput = document.getElementById('taskInput');
            const description = taskInput.value.trim();
            
            if (description) {
                modules.tasks.tasks.push({
                    id: Date.now(),
                    description,
                    completed: false,
                    createdAt: new Date().toISOString()
                });
                
                saveTasks();
                renderTasks();
                updateTaskStats();
                showNotification('¡Tarea añadida!', 'success');
                taskInput.value = '';
                taskInput.focus();
            }
        }

        function deleteTask(id) {
            modules.tasks.tasks = modules.tasks.tasks.filter(task => task.id !== id);
            saveTasks();
            renderTasks();
            updateTaskStats();
            showNotification('Tarea eliminada', 'warning');
        }

        function toggleCompleted(id) {
            modules.tasks.tasks = modules.tasks.tasks.map(task => 
                task.id === id ? {...task, completed: !task.completed} : task
            );
            saveTasks();
            renderTasks();
            updateTaskStats();
        }

        function saveTasks() {
            localStorage.setItem('tasks', JSON.stringify(modules.tasks.tasks));
        }

        function renderTasks() {
            const taskList = document.getElementById('taskList');
            let filteredTasks = modules.tasks.tasks;
            
            if (modules.tasks.currentFilter === 'active') {
                filteredTasks = modules.tasks.tasks.filter(task => !task.completed);
            } else if (modules.tasks.currentFilter === 'completed') {
                filteredTasks = modules.tasks.tasks.filter(task => task.completed);
            }
            
            taskList.innerHTML = '';
            
            if (filteredTasks.length === 0) {
                taskList.innerHTML = '<div class="no-tasks bubble">No hay tareas para mostrar</div>';
                return;
            }
            
            filteredTasks.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.className = 'task-item';
                
                // Formatear fecha
                const date = new Date(task.createdAt);
                const formattedDate = `${date.getDate()}/${date.getMonth()+1} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                
                taskItem.innerHTML = `
                    <div class="task-content">
                        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                        <span class="task-text ${task.completed ? 'completed' : ''}">${task.description}</span>
                        <span class="task-date">${formattedDate}</span>
                    </div>
                    <button class="delete-task-btn"><i class="fas fa-trash"></i></button>
                `;
                
                const checkbox = taskItem.querySelector('.task-checkbox');
                const deleteBtn = taskItem.querySelector('.delete-task-btn');
                
                checkbox.addEventListener('change', () => toggleCompleted(task.id));
                deleteBtn.addEventListener('click', () => deleteTask(task.id));
                
                taskList.appendChild(taskItem);
            });
        }

        function updateTaskStats() {
            const totalTasks = modules.tasks.tasks.length;
            const completedTasks = modules.tasks.tasks.filter(task => task.completed).length;
            const pendingTasks = totalTasks - completedTasks;
            
            document.getElementById('totalTasks').textContent = `Total: ${totalTasks}`;
            document.getElementById('completedTasks').textContent = `Completadas: ${completedTasks}`;
            document.getElementById('pendingTasks').textContent = `Pendientes: ${pendingTasks}`;
        }

        // ==========================================
        // MÓDULO 2: CITAS DE ANIME
        // ==========================================
        function initQuoteGenerator() {
            const dailyQuoteBtn = document.getElementById('dailyQuoteBtn');
            const saveQuoteBtn = document.getElementById('saveQuoteBtn');
            
            // Event listeners
            dailyQuoteBtn.addEventListener('click', fetchQuote);
            saveQuoteBtn.addEventListener('click', saveCurrentQuote);
            
            // Cargar cita inicial
            fetchQuote();
            renderSavedQuotes();
        }

        async function fetchQuote() {
            const quoteDisplay = document.getElementById('quoteDisplay');
            
            // Mostrar carga
            quoteDisplay.innerHTML = `
                <div class="loading-quote">
                    <div class="manga-spinner"></div>
                    <p>Cargando cita inspiradora...</p>
                </div>
            `;
            
            try {
                // Usamos API de citas de anime
                const response = await fetch('https://animechan.xyz/api/random');
                if (!response.ok) throw new Error('Error al obtener la cita');
                
                const data = await response.json();
                const quote = data.quote;
                const character = data.character;
                const anime = data.anime;
                
                // Guardar cita actual para posible guardado
                modules.quotes.currentQuote = { quote, character, anime };
                
                // Mostrar la cita
                quoteDisplay.innerHTML = `
                    <div class="quote-text">"${quote}"</div>
                    <div class="quote-character">- ${character}</div>
                    <div class="quote-anime">${anime}</div>
                `;
                
                showNotification('¡Cita de anime cargada!', 'success');
            } catch (error) {
                // Si la API falla, usar citas locales
                const localQuotes = [
                    { quote: "No importa cuántas veces tropieces, lo importante es cuántas veces te levantes.", character: "Naruto Uzumaki", anime: "Naruto" },
                    { quote: "El verdadero terror es perder algo importante para ti.", character: "Itachi Uchiha", anime: "Naruto" },
                    { quote: "Si no arriesgas tu vida, no puedes crear un futuro.", character: "Monkey D. Luffy", anime: "One Piece" },
                    { quote: "La vida no se trata de esperar a que pase la tormenta, sino de aprender a bailar bajo la lluvia.", character: "Violet Evergarden", anime: "Violet Evergarden" },
                    { quote: "El mundo no es perfecto. Pero está ahí para nosotros, haciendo lo mejor que puede.", character: "Roy Mustang", anime: "Fullmetal Alchemist" }
                ];
                
                const randomQuote = localQuotes[Math.floor(Math.random() * localQuotes.length)];
                modules.quotes.currentQuote = randomQuote;
                
                quoteDisplay.innerHTML = `
                    <div class="quote-text">"${randomQuote.quote}"</div>
                    <div class="quote-character">- ${randomQuote.character}</div>
                    <div class="quote-anime">${randomQuote.anime}</div>
                `;
                
                showNotification('Cita de anime cargada (local)', 'info');
                console.error('Error fetching quote:', error);
            }
        }

        function saveCurrentQuote() {
            if (!modules.quotes.currentQuote) {
                showNotification('No hay cita para guardar', 'warning');
                return;
            }
            
            // Verificar si la cita ya está guardada
            const isAlreadySaved = modules.quotes.savedQuotes.some(savedQuote => 
                savedQuote.quote === modules.quotes.currentQuote.quote
            );
            
            if (isAlreadySaved) {
                showNotification('Esta cita ya está guardada', 'info');
                return;
            }
            
            // Guardar la cita
            modules.quotes.savedQuotes.push(modules.quotes.currentQuote);
            localStorage.setItem('savedQuotes', JSON.stringify(modules.quotes.savedQuotes));
            renderSavedQuotes();
            showNotification('Cita guardada con éxito', 'success');
        }

        function renderSavedQuotes() {
            const savedQuotesContainer = document.getElementById('savedQuotes');
            savedQuotesContainer.innerHTML = '';
            
            if (modules.quotes.savedQuotes.length === 0) {
                savedQuotesContainer.innerHTML = '<p class="no-saved-quotes">No tienes citas guardadas aún</p>';
                return;
            }
            
            modules.quotes.savedQuotes.forEach((quoteObj, index) => {
                const quoteElement = document.createElement('div');
                quoteElement.className = 'saved-quote bubble';
                quoteElement.innerHTML = `
                    <div class="saved-quote-text">"${quoteObj.quote}"</div>
                    <div class="saved-quote-info">- ${quoteObj.character} (${quoteObj.anime})</div>
                    <button class="delete-quote-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
                `;
                
                const deleteBtn = quoteElement.querySelector('.delete-quote-btn');
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteSavedQuote(index);
                });
                
                savedQuotesContainer.appendChild(quoteElement);
            });
        }

        function deleteSavedQuote(index) {
            modules.quotes.savedQuotes.splice(index, 1);
            localStorage.setItem('savedQuotes', JSON.stringify(modules.quotes.savedQuotes));
            renderSavedQuotes();
            showNotification('Cita eliminada', 'warning');
        }

        // ==========================================
        // MÓDULO 3: CONVERSOR DE DIVISAS
        // ==========================================
        function initCurrencyConverter() {
            const convertBtn = document.getElementById('convertBtn');
            
            // Event listener
            convertBtn.addEventListener('click', convertCurrency);
            
            // Cargar tasas iniciales
            loadExchangeRates();
        }

        async function loadExchangeRates() {
            try {
                // Usamos Frankfurter.app API
                const response = await fetch('https://api.frankfurter.app/latest');
                if (!response.ok) throw new Error('Error al obtener tasas de cambio');
                
                const data = await response.json();
                modules.currency.rates = data.rates;
                
                // Crear gráfico histórico
                createHistoricalChart();
            } catch (error) {
                console.error('Error loading exchange rates:', error);
                showNotification('Error al cargar tasas de cambio', 'error');
            }
        }

        async function convertCurrency() {
            const fromCurrency = document.getElementById('fromCurrency').value;
            const toCurrency = document.getElementById('toCurrency').value;
            const amount = parseFloat(document.getElementById('amount').value);
            const resultDisplay = document.getElementById('conversionResult');
            const rateInfo = document.getElementById('rateInfo');
            
            if (isNaN(amount) || amount <= 0) {
                showNotification('Ingresa una cantidad válida', 'warning');
                return;
            }
            
            if (fromCurrency === toCurrency) {
                resultDisplay.textContent = `${amount} ${fromCurrency}`;
                rateInfo.textContent = 'Tasa actual: 1.00 (misma moneda)';
                return;
            }
            
            try {
                // Mostrar estado de carga
                resultDisplay.textContent = 'Calculando...';
                rateInfo.textContent = 'Obteniendo tasa actual...';
                
                // Usamos la API para conversión precisa
                const response = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`);
                if (!response.ok) throw new Error('Error al realizar la conversión');
                
                const data = await response.json();
                const result = data.rates[toCurrency];
                
                // Mostrar resultado
                resultDisplay.innerHTML = `<span class="result-amount">${result.toFixed(2)}</span> ${toCurrency}`;
                const rate = (result / amount).toFixed(4);
                rateInfo.textContent = `Tasa actual: 1 ${fromCurrency} = ${rate} ${toCurrency}`;
                
                showNotification('Conversión realizada', 'success');
            } catch (error) {
                resultDisplay.textContent = '-';
                rateInfo.textContent = 'Error en la conversión';
                console.error('Error converting currency:', error);
                showNotification('Error en la conversión', 'error');
            }
        }

        function createHistoricalChart() {
            const ctx = document.getElementById('currencyChart').getContext('2d');
            
            // Datos de ejemplo para el gráfico
            const labels = ['Hace 6 días', 'Hace 5 días', 'Hace 4 días', 'Hace 3 días', 'Hace 2 días', 'Ayer', 'Hoy'];
            const data = [1.12, 1.13, 1.125, 1.14, 1.135, 1.13, 1.128];
            
            if (modules.currency.chart) {
                modules.currency.chart.destroy();
            }
            
            modules.currency.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'USD a EUR',
                        data: data,
                        borderColor: '#ff6b6b',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        borderWidth: 3,
                        pointBackgroundColor: '#4361ee',
                        pointRadius: 5,
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            labels: {
                                font: {
                                    family: "'Comic Neue', cursive",
                                    size: 14
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#f8f9fa',
                                font: {
                                    family: "'Nunito', sans-serif"
                                }
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#f8f9fa',
                                font: {
                                    family: "'Nunito', sans-serif"
                                }
                            }
                        }
                    }
                }
            });
        }

        // ==========================================
        // MÓDULO 4: CUESTIONARIO
        // ==========================================
        function initQuizApp() {
            const prevBtn = document.getElementById('prevQuestionBtn');
            const nextBtn = document.getElementById('nextQuestionBtn');
            const restartBtn = document.getElementById('restartQuizBtn');
            
            // Event listeners
            prevBtn.addEventListener('click', prevQuestion);
            nextBtn.addEventListener('click', nextQuestion);
            restartBtn.addEventListener('click', restartQuiz);
            
            // Cargar preguntas
            loadQuizQuestions();
        }

        function loadQuizQuestions() {
            // Preguntas en español sobre anime y cultura general
            const questions = [
                {
                    question: "¿Cuál es el nombre del protagonista de 'Death Note'?",
                    options: ["Light Yagami", "L Lawliet", "Misa Amane", "Near"],
                    correctAnswer: 0
                },
                {
                    question: "¿En qué anime aparece el personaje llamado 'Eren Jaeger'?",
                    options: ["Naruto", "Attack on Titan", "One Piece", "Bleach"],
                    correctAnswer: 1
                },
                {
                    question: "¿Cuál es el nombre del universo ficticio donde transcurre 'Dragon Ball'?",
                    options: ["Tierra Media", "Planeta Namek", "Universo 7", "Galaxia Andrómeda"],
                    correctAnswer: 2
                },
                {
                    question: "¿Qué significa 'Naruto' en japonés?",
                    options: ["Huracán", "Remolino", "Torbellino", "Vórtice"],
                    correctAnswer: 2
                },
                {
                    question: "¿Cuál es el nombre del barco de Monkey D. Luffy en 'One Piece'?",
                    options: ["Thousand Sunny", "Going Merry", "Red Force", "Oro Jackson"],
                    correctAnswer: 1
                },
                {
                    question: "¿Qué tipo de criatura es Totoro?",
                    options: ["Un oso", "Un espíritu del bosque", "Un gato gigante", "Un conejo mágico"],
                    correctAnswer: 1
                },
                {
                    question: "¿Cuál es el lema de los Caballeros del Zodiaco?",
                    options: ["Por la justicia y el honor", "Con el poder de las estrellas", ["Por la diosa Atenea", "Protegiendo la Tierra"]],
                    correctAnswer: 2
                }
            ];
            
            // Mezclar preguntas
            shuffleArray(questions);
            // Tomar solo 5 preguntas
            modules.quiz.questions = questions.slice(0, 5);
            
            // Actualizar contadores
            document.getElementById('totalQuestions').textContent = modules.quiz.questions.length;
            
            // Renderizar primera pregunta
            renderQuestion();
        }

        function renderQuestion() {
            if (modules.quiz.currentQuestionIndex >= modules.quiz.questions.length) {
                showResults();
                return;
            }
            
            const question = modules.quiz.questions[modules.quiz.currentQuestionIndex];
            const quizQuestion = document.getElementById('quizQuestion');
            const quizOptions = document.getElementById('quizOptions');
            const prevBtn = document.getElementById('prevQuestionBtn');
            const nextBtn = document.getElementById('nextQuestionBtn');
            const feedback = document.getElementById('quizFeedback');
            
            // Actualizar contador
            document.getElementById('currentQuestion').textContent = modules.quiz.currentQuestionIndex + 1;
            document.getElementById('currentScore').textContent = modules.quiz.score;
            
            // Mostrar pregunta
            quizQuestion.innerHTML = `
                <div class="question-text">${question.question}</div>
            `;
            
            // Mostrar opciones
            quizOptions.innerHTML = '';
            question.options.forEach((option, index) => {
                const optionBtn = document.createElement('button');
                optionBtn.className = 'option-btn bubble';
                optionBtn.textContent = option;
                optionBtn.dataset.option = index;
                
                optionBtn.addEventListener('click', () => selectAnswer(index));
                quizOptions.appendChild(optionBtn);
            });
            
            // Actualizar botones
            prevBtn.disabled = modules.quiz.currentQuestionIndex === 0;
            nextBtn.disabled = !modules.quiz.answered;
            
            // Limpiar feedback
            feedback.textContent = '';
            feedback.className = 'quiz-feedback bubble';
        }

        function selectAnswer(selectedIndex) {
            if (modules.quiz.answered) return;
            
            modules.quiz.answered = true;
            const question = modules.quiz.questions[modules.quiz.currentQuestionIndex];
            const feedback = document.getElementById('quizFeedback');
            const nextBtn = document.getElementById('nextQuestionBtn');
            const optionButtons = document.querySelectorAll('.option-btn');
            
            // Habilitar botón siguiente
            nextBtn.disabled = false;
            
            // Verificar respuesta
            const isCorrect = selectedIndex === question.correctAnswer;
            
            // Actualizar puntuación
            if (isCorrect) {
                modules.quiz.score++;
                document.getElementById('currentScore').textContent = modules.quiz.score;
            }
            
            // Marcar respuestas
            optionButtons.forEach((btn, index) => {
                if (index === question.correctAnswer) {
                    btn.classList.add('correct');
                } else if (index === selectedIndex) {
                    btn.classList.add('incorrect');
                }
                
                btn.disabled = true;
            });
            
            // Mostrar feedback
            if (isCorrect) {
                feedback.textContent = '¡Respuesta correcta!';
                feedback.classList.add('correct');
                showNotification('¡Correcto! +1 punto', 'success');
            } else {
                feedback.innerHTML = `Incorrecto. La respuesta correcta es: <strong>${question.options[question.correctAnswer]}</strong>`;
                feedback.classList.add('incorrect');
                showNotification('Respuesta incorrecta', 'warning');
            }
        }

        function prevQuestion() {
            if (modules.quiz.currentQuestionIndex > 0) {
                modules.quiz.currentQuestionIndex--;
                modules.quiz.answered = false;
                renderQuestion();
            }
        }

        function nextQuestion() {
            modules.quiz.currentQuestionIndex++;
            modules.quiz.answered = false;
            renderQuestion();
        }

        function showResults() {
            const quizQuestion = document.getElementById('quizQuestion');
            const quizOptions = document.getElementById('quizOptions');
            const feedback = document.getElementById('quizFeedback');
            const quizControls = document.querySelector('.quiz-controls');
            
            const totalQuestions = modules.quiz.questions.length;
            const percentage = Math.round((modules.quiz.score / totalQuestions) * 100);
            let message = '';
            
            if (percentage >= 80) message = '¡Excelente! Eres un experto en anime';
            else if (percentage >= 60) message = '¡Buen trabajo! Sabes bastante de anime';
            else if (percentage >= 40) message = 'Puedes mejorar, sigue viendo anime';
            else message = 'Sigue practicando y viendo más anime';
            
            quizQuestion.innerHTML = `
                <div class="quiz-results">
                    <h3>Resultados del Cuestionario</h3>
                    <div class="score-display">${modules.quiz.score}/${totalQuestions}</div>
                    <div class="percentage">${percentage}% de respuestas correctas</div>
                    <p>${message}</p>
                </div>
            `;
            
            quizOptions.innerHTML = '';
            feedback.textContent = '';
            quizControls.style.display = 'none';
        }

        function restartQuiz() {
            modules.quiz.currentQuestionIndex = 0;
            modules.quiz.score = 0;
            modules.quiz.answered = false;
            document.getElementById('currentScore').textContent = '0';
            document.querySelector('.quiz-controls').style.display = 'flex';
            renderQuestion();
        }

        // ==========================================
        // FUNCIONES UTILITARIAS
        // ==========================================
        function showNotification(message, type) {
            const notificationArea = document.getElementById('notificationArea');
            const notification = document.createElement('div');
            
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <div class="notification-content">${message}</div>
                <div class="notification-progress"></div>
            `;
            
            notificationArea.appendChild(notification);
            
            // Animación de entrada
            setTimeout(() => {
                notification.style.transform = 'translateY(0)';
                notification.style.opacity = '1';
            }, 10);
            
            // Auto-eliminar después de 3 segundos
            setTimeout(() => {
                notification.style.transform = 'translateY(-100%)';
                notification.style.opacity = '0';
                
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function loadInitialData() {
            // Cargar estadísticas de tareas
            updateTaskStats();
            
            // Cargar citas guardadas
            renderSavedQuotes();
        }