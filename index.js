// TODO: Add data recording

import questions from './questions.js';

let currentQuestionIndex = 0;
let totalScore = 0;

// Page transition function
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Initialize quiz
function initQuiz() {
    currentQuestionIndex = 0;
    totalScore = 0;
    userAnswers = [];
    displayQuestion();
    showPage('quiz-page');
}

// Display current question
function displayQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('question').textContent = question.question;
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        
        const label = document.createElement('span');
        label.className = 'option-label';
        label.textContent = String.fromCharCode(65 + index);
        
        const text = document.createTextNode(` ${option}`);
        
        button.appendChild(label);
        button.appendChild(text);
        button.onclick = () => handleAnswer(index);
        optionsContainer.appendChild(button);
    });
}

// Store user answers
let userAnswers = [];

// Handle answer selection
function handleAnswer(optionIndex) {
    const points = questions[currentQuestionIndex].points[optionIndex];
    totalScore += points;
    
    // Record answer (A, B, C, D based on index)
    userAnswers[currentQuestionIndex] = String.fromCharCode(65 + optionIndex);
    
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        // Save results to local storage
        const timestamp = new Date().toISOString();
        const quizRecord = {
            time: timestamp,
            Q1: userAnswers[0],
            Q2: userAnswers[1],
            Q3: userAnswers[2],
            Q4: userAnswers[3],
            Q5: userAnswers[4],
            total_score: totalScore
        };
        
        // Get existing records or initialize empty array
        const existingRecords = JSON.parse(localStorage.getItem('quizRecords') || '[]');
        existingRecords.push(quizRecord);
        localStorage.setItem('quizRecords', JSON.stringify(existingRecords));
        
        showResults();
    }
}

// Show results
function showResults() {
    const scoreElement = document.getElementById('score');
    const messageElement = document.getElementById('result-message');
    
    scoreElement.textContent = totalScore + ' POINTS';
    
    if (totalScore >= 12) {
        messageElement.textContent = 'WUHOO! YOU ARE DIGITAL SAVVY!';
    } else if (totalScore >= 6) {
        messageElement.textContent = 'YOU ARE NOT DIGITAL SAVVY ENOUGH';
    } else if (totalScore >= 1) {
        messageElement.textContent = 'YOU ARE NOT DIGITAL SAVVY, TIME TO TRANSFORM!';
    } else {
        messageElement.textContent = 'WHAT ARE YOU?';
    }
    
    showPage('result-page');
}

// Convert quiz records to CSV format
function convertToCSV() {
    const records = JSON.parse(localStorage.getItem('quizRecords') || '[]');
    if (records.length === 0) return '';
    
    const headers = Object.keys(records[0]).join(',');
    const rows = records.map(record => Object.values(record).join(','));
    
    return [headers, ...rows].join('\n');
}

// Download quiz records as CSV
function downloadResults() {    
    const csv = convertToCSV();
    if (!csv) {
        alert('No quiz records found! Complete the quiz first.');
        return;
    }
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'quiz_results.csv';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Event Listeners
document.getElementById('start-btn').addEventListener('click', initQuiz);
// document.getElementById('download-btn').addEventListener('click', downloadResults);
document.getElementById('claim-btn').addEventListener('click', () => showPage('prize-page'));
document.getElementById('return-btn').addEventListener('click', () => showPage('start-page'));
