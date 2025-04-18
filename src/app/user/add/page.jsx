import AddUserForm from "@/components/forms/AddUserForm";

export default async function AddUserPage() {
  return (
    <div>
      <h2 className="text-center">Insert User Manually</h2>
      <p className="text-justify">
        Users must be in the database before they can interact with the Maplist.
        Most of the time this is done automatically when they log in or they
        submit something through the bot, but in case someone has never
        interacted with the project, you can add them manually here.
        <br />
        <br />
        In all fields where you have to put a user, you can put their Maplist
        name or their Discord ID, interchangably.
      </p>
      <AddUserForm />
    </div>
  );
}
