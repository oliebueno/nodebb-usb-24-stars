'use strict';

define('composer/getSimilarQuestions', [], function () {
	const getSimilarQuestions = {};

    getSimilarQuestions.fetchSimilarQuestions = function (inputTitleQuestion) {
        // se obtiene la categoria con cid = 5 que es Questions & Answers
        $.get('/api/category/5', function (data) {
            // se obtiene los topics de esta categoria
            const allQuestions = data.topics;
            
            // si no hay topics en la categoria, se retorna
            if (!allQuestions.length) {
                return;
            }

            // aqui se comparan las palabras del titulo de la pregunta actual con las palabras de los titulos de 
            // preguntas anteriores

            // funcion para eliminar los acentos, convertirlos en minusculas
            // y eliminar los caracteres especiales
            const NormalizeWords = (str) => {
                return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s]/gi, '');
            };

            const inputTitleQuestionWords = NormalizeWords(inputTitleQuestion).split(' ').map(word => word.toLowerCase());
            const similarResults = allQuestions.filter(topic => {
                const topicWords = NormalizeWords(topic.title).split(' ').map(word => word.toLowerCase());
                const commonWords = topicWords.filter(word => inputTitleQuestionWords.includes(word));
                // si existe al menos una palabra en comun, se agrega a los resultados
                // agregar tambien la longitud de las palabras en comun para poder ordenar los resultados
                topic.commonWordsCount = commonWords.length;
                return commonWords.length > 0;
            });

            // ordenar los resultados por la cantidad de palabras en comun
            similarResults.sort((a, b) => b.commonWordsCount - a.commonWordsCount);

            // mostrar los resultados en la consola
            console.log(similarResults);
            
        });
    };

	return getSimilarQuestions;
});
