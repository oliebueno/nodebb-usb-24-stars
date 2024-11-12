const toggleFavorite = async (button, tid) => {

	const userFavoritesResponse = await api.get(`/plugins/users/favorites/${app.user.uid}`);
	let userFavorites = userFavoritesResponse.split(',').map(Number).filter(num => !isNaN(num));

	console.log("userFavorites", userFavorites);
	console.log("tid", tid);

	const isFavorited = userFavorites.includes(tid);
	console.log("isFavorited", isFavorited);

	const newFavorites = isFavorited
		? userFavorites.filter(id => id !== tid)
		: [...userFavorites, tid];

	console.log("newFavorites", newFavorites);

	api.post(`/plugins/users/favorites/${app.user.uid}`, { uid: app.user.uid, favorites: newFavorites.join(',') }, (err) => {
		if (err) {
			if (!app.user.uid) {
				ajaxify.go('login');
				return;
			}
			return alerts.error(err);
		}

		button.toggleClass('favorited', !isFavorited);
		button.find('i').toggleClass('fa-star fa-star-o');
		console.log("Favorito actualizado, nuevo estado:", !isFavorited);
	});
};

const initFavoriteButton = (button) => {
	const tid = button.data('tid');

	api.get(`/plugins/users/favorites/${app.user.uid}`).then(userFavoritesResponse => {
		let userFavorites = userFavoritesResponse.split(',').map(Number).filter(num => !isNaN(num));

		console.log("userFavorites al cargar:", userFavorites);

		if (userFavorites.includes(tid)) {
			button.addClass('favorited');
			button.find('i').addClass('fa-star').removeClass('fa-star-o');
			console.log("El tema ya está en favoritos.");
		} else {
			button.find('i').addClass('fa-star-o').removeClass('fa-star');
			console.log("El tema no está en favoritos.");
		}
	});

	button.on('click', () => {
		console.log("button click");
		toggleFavorite(button, tid);
	});
};

const initFav = () => {
	const buttons = components.get('topic/favoriteButton');
	buttons.each(function () {
		const button = $(this);
		initFavoriteButton(button);
	});
};

initFav();