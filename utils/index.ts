import axios from "axios";
import {KeyedMutator} from "swr";

export const convertToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export const toDate = (timeString: string) => {
    const now = new Date();
    const [hours, minutes] = timeString.split(":");

    now.setHours(Number(hours));
    now.setMinutes(Number(minutes));

    return now.toLocaleTimeString();
};

export const handleActiveStatus = async (router: any,status: string, mutate?: KeyedMutator<any>) => {

    try {
        const data = {
            isActive: status === "online"
        }
        const res = await axios.patch("/api/users", data, {
            headers: {
                "Content-Type": "application/json"
            }
        })


        if (res.status === 200) {
            router.refresh()
            mutate && await mutate("/api/users")
        }
    } catch (err: Error | any) {
    }
}
