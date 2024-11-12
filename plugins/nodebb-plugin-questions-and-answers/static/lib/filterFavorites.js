const showFavorites = async () => {
	const userFavoritesResponse = await api.get(`/plugins/users/favorites/${app.user.uid}`);
	let userFavorites = userFavoritesResponse.split(',').map(Number).filter(num => !isNaN(num));
	let allTopics = [];

	const $topicsContainer = $('#topics-container ul');

	if (userFavorites.length === 1) {
		$topicsContainer.empty();
		const messagesHtml =
			`
                <li>You have no favorite questions</li>
            `;
		$topicsContainer.append(messagesHtml);
		console.log("TopicsContainer");

	} else {

		allTopics = await $.get('/api/category/5');

		const favoritesToFetch = userFavorites.slice(1);
		const topics = allTopics.topics.filter(topic => favoritesToFetch.includes(topic.tid));

		const $topicsContainerAll = $('ul[component="category"].topics-list');
		$topicsContainerAll.empty()
		$topicsContainer.empty();
		const topicsHtml = topics.map(topic => {
			return `
                <li component="category/topic" class="category-item hover-parent border-bottom py-3 py-lg-4 d-flex flex-column flex-lg-row align-items-start">
                    <div class="d-flex p-0 col-12 col-lg-7 gap-2 gap-lg-3 pe-1 align-items-start">
                        <div class="flex-shrink-0 position-relative">
                            <a class="text-decoration-none" href="${topic.user.userslug ? `${config.relative_path}/user/${topic.user.userslug}` : '#'}">
                                <i class="fas fa-star" style="font-size: 40px; color: yellow;"></i>
                            </a>
                        </div>
                        <div class="flex-grow-1 d-flex flex-wrap gap-1 position-relative">
                            <span component="topic/courseTag" class="badge bg-light text-primary border border-gray-300 ">#${topic.courseTag}</span>
                            <h3 component="topic/header" class="title text -break fs-5 fw-semibold m-0 tracking-tight w-100">
                                <a class="text-reset" href="${config.relative_path}/topic/${topic.slug}">${topic.title}</a>
                            </h3>
                            <span component="topic/post-count" class="badge border border-gray-300 text-body">
                                <i class="fa-regular fa-fw fa-message"></i>
                                Favotites
                            </span>
                        </div>
                    </div>
                </li>
            `;
		}).join('');


		$topicsContainer.append(topicsHtml);
	}
};

$('#showFavoritesButton').on('click', () => {
	showFavorites();
});