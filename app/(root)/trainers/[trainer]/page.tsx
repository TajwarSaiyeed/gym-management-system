import ClientOnly from "@/app/components/ClientOnly/ClientOnly";
import Empty from "@/app/components/Empty";
import getUser from "@/app/actions/getUser";
import UserClient from "@/app/components/User/User";

export default async function TrainerPage(props: {
  params: Promise<{ trainer: string }>;
}) {
  const params = await props.params;

  if (!params?.trainer) {
    return (
      <ClientOnly>
        <Empty
          title="No trainer selected"
          subtitle="Please select a trainer from the list"
        />
      </ClientOnly>
    );
  }

  const trainer = await getUser({ userId: params.trainer });

  if (!trainer) {
    return (
      <ClientOnly>
        <Empty title="No User" subtitle="No Data Found" />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <UserClient user={trainer} />
    </ClientOnly>
  );
}
