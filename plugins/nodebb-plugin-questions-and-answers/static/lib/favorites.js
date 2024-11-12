const toggleFavorite = async (button, tid) => {

	const userFavoritesResponse = await api.get(`/plugins/users/favorites/${app.user.uid}`);
	let userFavorites = userFavoritesResponse.split(',').map(Number).filter(num => !isNaN(num));
	const isFavorited = userFavorites.includes(tid);

	const newFavorites = isFavorited
		? userFavorites.filter(id => id !== tid)
		: [...userFavorites, tid];

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
	});
};

const initFavoriteButton = (button) => {
	const tid = button.data('tid');

	api.get(`/plugins/users/favorites/${app.user.uid}`).then(userFavoritesResponse => {
		let userFavorites = userFavoritesResponse.split(',').map(Number).filter(num => !isNaN(num));

		if (userFavorites.includes(tid)) {
			button.addClass('favorited');
			button.find('i').addClass('fa-star').removeClass('fa-star-o');
		} else {
			button.find('i').addClass('fa-star-o').removeClass('fa-star');
		}
	});

	button.on('click', () => {
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