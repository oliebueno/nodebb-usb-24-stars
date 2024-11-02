<button type="button" class="btn-ghost-sm ff-secondary d-flex gap-2 dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    {{{ if selectedTag }}}
    <span class="d-inline-flex align-items-center gap-1">
        <i class="fa fa-fw fa-tags text-primary"></i>
        <span class="visible-md-inline visible-lg-inline fw-semibold">{{selectedTag.label}}</span>
    </span>
    {{{ else }}}
    <i class="fa fa-fw fa-tags text-primary"></i>
    <span class="visible-md-inline visible-lg-inline fw-semibold">[[tags:all-courses]]</span>
    {{{ end }}}
</button>

<div component="tag/filter/search" class="hidden position-absolute top-0">
    <input type="text" class="form-control form-control-sm" placeholder="[[search:type-to-search]]" autocomplete="off">
</div>

<div class="dropdown-menu">
    <ul id="tag-list" class="list-unstyled mb-0" style="max-height: 300px; overflow-y: auto;">
        {{{ each tagCourse }}}
        <li>
            <a class="dropdown-item" href="#" data-tag="{{./valueEscaped}}">{{./valueEscaped}}</a>
        </li>
        {{{ end }}}
    </ul>
</div>


<script>
    $(document).ready(function() {
        // Obtener las etiquetas de la API
        $.get('/api/category/5', function(data) {
            if (data.topics && Array.isArray(data.topics)) {
                const tagCourses = data.topics.map(topic => topic.courseTag).flat();
				console.log(tagCourses);

				const tagList = $('#tag-list');
				tagCourses.forEach(function(tag) {
					const listItem = `
						<li>
							<a class="dropdown-item" href="#" data-tag="${tag}">${tag}</a>
						</li>
					`;
					tagList.append(listItem);
					console.log(listItem);
				});

                $('#tag-list a').on('click', function(event) {
                    event.preventDefault();
                    const selectedTag = $(this).data('tag');
                    $('#selected-tag').text(selectedTag); // Actualizar el texto del botón

                    $.get(`/api/topics?tag=${selectedTag}`, function(topicsData) {
                        const topicsList = $('#topics-list');
                        topicsList.empty(); // Limpiar la lista de tópicos

                        if (topicsData && Array.isArray(topicsData)) {
                            topicsData.forEach(function(topic) {
                                const topicItem = `<li>${topic.title}</li>`;
                                topicsList.append(topicItem);
                            });
                        } else {
                            topicsList.append('<li>No se encontraron tópicos asociados.</li>');
                        }
                    }).fail(function(jqXHR, textStatus, errorThrown) {
                        console.error('Error al obtener los tópicos:', textStatus, errorThrown);
                    });
                });
            } else {
                console.error('No se encontraron temas en los datos.');
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error('Error al hacer la solicitud:', textStatus, errorThrown);
        });
    });
</script>