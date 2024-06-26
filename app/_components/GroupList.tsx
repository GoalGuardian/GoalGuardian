import { delete_group } from "@/lib/manage-group";
import { UserGroups, Users } from "@prisma/client";

interface Params {
  groups: ({
    users: Users[];
  } & UserGroups)[];
  users: CustomUser[];
}

export default function GroupList({ groups, users }: Params) {
  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Group Name
              </th>
              <th scope="col" className="px-6 py-3">
                Members
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr
                key={group.id}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {group.name}
                </th>
                <td className="px-6 py-4">
                  {group.users
                    .map(
                      // Since only the Clerk user object has the name, we need to find the corresponding
                      // Clerk user object for each user in the group, searching by the Clerk ID that we
                      // store in our database.
                      // We then want to map the list of names to a single string, so we use join(", ")
                      (user) =>
                        users.find(
                          (clerkUser) => clerkUser.clerkId == user.clerkId,
                        )!.name,
                    )
                    .join(", ")}
                </td>
                <td className="px-6 py-4">
                  <a
                    href="#"
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit
                  </a>
                  <a
                    href={`/api/group?id=${group.id}`}
                    className="font-bold text-red-600 dark:text-blue-500 hover:underline ml-4 border border-red-600 px-2 py-1 rounded"
                  >
                    Delete
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
