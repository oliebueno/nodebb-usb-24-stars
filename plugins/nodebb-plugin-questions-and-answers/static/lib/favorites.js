const toggleFavorite = async (button, tid) => {
	// Obtén los favoritos del usuario
	const userFavoritesResponse = await api.get(`/plugins/users/favorites/${app.user.uid}`);
	let userFavorites = userFavoritesResponse.split(',').map(Number).filter(num => !isNaN(num));

	console.log("userFavorites", userFavorites);
	console.log("tid", tid);

	const isFavorited = userFavorites.includes(tid); // Verifica si el tid está en la lista
	console.log("isFavorited", isFavorited);

	// Cambia el estado de favoritos
	const newFavorites = isFavorited
		? userFavorites.filter(id => id !== tid) // Si ya está en favoritos, lo quitamos
		: [...userFavorites, tid]; // Si no está, lo agregamos

	console.log("newFavorites", newFavorites);

	// Actualiza la base de datos
	api.post(`/plugins/users/favorites/${app.user.uid}`, { uid: app.user.uid, favorites: newFavorites.join(',') }, (err) => {
		if (err) {
			if (!app.user.uid) { // Si el usuario no está logueado
				ajaxify.go('login'); // Redirige a la página de login
				return;
			}
			return alerts.error(err); // Muestra un error
		}

		// Actualiza el ícono de la estrella
		button.toggleClass('favorited', !isFavorited);
		button.find('i').toggleClass('fa-star fa-star-o'); // Cambia el ícono de estrella
		console.log("Favorito actualizado, nuevo estado:", !isFavorited);
	});
};

const initFavoriteButton = (button) => {
	const tid = button.data('tid'); // Obtén el tid del tema

	// Verifica si el tema está en favoritos al cargar la página
	api.get(`/plugins/users/favorites/${app.user.uid}`).then(userFavoritesResponse => {
		let userFavorites = userFavoritesResponse.split(',').map(Number).filter(num => !isNaN(num));

		console.log("userFavorites al cargar:", userFavorites);

		if (userFavorites.includes(tid)) {
			button.addClass('favorited'); // Marca el botón si el tema está en favorito
			button.find('i').addClass('fa-star').removeClass('fa-star-o'); // Cambia el ícono a estrella llena
			console.log("El tema ya está en favoritos.");
		} else {
			button.find('i').addClass('fa-star-o').removeClass('fa-star'); // Cambia el ícono a estrella vacía
			console.log("El tema no está en favoritos.");
		}
	});

	// Agrega el evento de clic al botón
	button.on('click', () => {
		console.log("button click");
		toggleFavorite(button, tid);
	});
};

const initFav = () => {
	const buttons = components.get('topic/favoriteButton'); // Obtén todos los botones de favorito
	buttons.each(function () {
		const button = $(this); // Obtén el botón de favoritos
		initFavoriteButton(button); // Inicializa cada botón de favoritos
	});
};

initFav();