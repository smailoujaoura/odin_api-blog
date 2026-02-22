import axios from "axios";
import { toast } from "sonner";

const handleApiErrors = (err: unknown, defaultMsg?: string) => {
	if (axios.isAxiosError(err)) {
		toast.error(err.response?.data.message || defaultMsg);
	} else {
		toast.error("Something went wrong.");
	}
}

export default handleApiErrors;