import * as components from "components";
import * as api from "api";

const init = () => {
	markAsOfficial();
	unmarkAsOfficial();
};

const markAsOfficial = () => {
	const buttons = components.get("post/markOfficial");
	toggleOfficial(buttons, true);
}

const unmarkAsOfficial = () => {
	const buttons = components.get("post/unmarkOfficial");
	toggleOfficial(buttons, false);
}

const toggleOfficial = (buttons, officialStatus) => {
	buttons.each(async function () {
		const button = $(this);
		const pid = button.parents("[data-pid]").data("pid");
		const editedData = { pid, official: officialStatus };
		button.on("click", async () => {
			await api.post(`/plugins/posts/official/${pid}`, editedData);
		});
	});
};

init();