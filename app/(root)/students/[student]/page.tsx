import ClientOnly from "@/app/components/ClientOnly/ClientOnly";
import Empty from "@/app/components/Empty";
import getUser from "@/app/actions/getUser";
import UserClient from "@/app/components/User/User";

const StudentPage = async (props: { params: Promise<{ student: string }> }) => {
  const params = await props.params;

  if (!params?.student) {
    return (
      <ClientOnly>
        <Empty
          title="No student selected"
          subtitle="Please select a student from the list"
        />
      </ClientOnly>
    );
  }

  const student = await getUser({ userId: params.student });

  if (!student) {
    return (
      <ClientOnly>
        <Empty title="No User" subtitle="No Data Found" />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <UserClient user={student} />
    </ClientOnly>
  );
};

export default StudentPage;
