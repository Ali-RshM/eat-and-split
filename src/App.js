import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [userSelect, setUserSelect] = useState(null);

  function AddFriendShowHandler() {
    setShowAddFriend((show) => !show);
  }
  function setNewFriend(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
    setShowAddFriend(false);
  }
  function handleSelection(frnd) {
    if (userSelect?.id === frnd.id) {
      setUserSelect(null);
      return;
    }
    setUserSelect(frnd);
    setShowAddFriend(false);
  }
  function splitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === userSelect.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setUserSelect(null)
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={userSelect}
        />
        {showAddFriend && <FormAddFriend setNewFriend={setNewFriend} />}
        <Button onClick={AddFriendShowHandler}>
          {" "}
          {showAddFriend ? "close" : "Add Friend"}
        </Button>
      </div>
      {userSelect && (
        <FormSplitBill selectedFriend={userSelect} onSplitBill={splitBill} />
      )}
    </div>
  );
}
function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <div>
      {friends.map((friends) => (
        <Friend
          friend={friends}
          key={friends.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </div>
  );
}
function Friend({ friend, onSelection, selectedFriend }) {
  const handleSelect = selectedFriend?.id === friend.id;
  return (
    <li className={handleSelect ? "selected" : ""}>
      <img src={friend.image} alt="" />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          you owe {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe you {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>you and {friend.name} are even</p>}
      <Button onClick={() => onSelection(friend)}>
        {handleSelect ? "close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ setNewFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function formAddFriendHandler(e) {
    e.preventDefault();
    if (!name || !image) {
      return;
    }
    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${image}?=${id}`,
      id,
      balance: 0,
    };
    setName("");
    setImage("https://i.pravatar.cc/48");
    setNewFriend(newFriend);
  }
  return (
    <form className="form-add-friend" onSubmit={formAddFriendHandler}>
      <label>👭 Friend Name</label>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <label>🖼️ Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <button className="button">Add Friend</button>
    </form>
  );
}
function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [billValue, setBillValue] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const [payer, setPayer] = useState("user");
  const friendExpense = billValue ? billValue - yourExpense : 0;
  function formSplitHandler(e) {
    e.preventDefault();
    if (!billValue || !yourExpense) return;
    onSplitBill(payer === "user" ? friendExpense : -friendExpense);
  }
  return (
    <form className="form-split-bill" onSubmit={formSplitHandler}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰 Bill Value</label>
      <input
        type="text"
        value={billValue ? billValue : ""}
        onChange={(e) => setBillValue(Number(e.target.value))}
      />
      <label>🧍‍♂️ Your expense</label>
      <input
        type="text"
        value={yourExpense ? yourExpense : ""}
        onChange={(e) => setYourExpense(Number(e.target.value))}
      />
      <label>👭 {selectedFriend.name} expense</label>
      <input type="text" disabled value={friendExpense} />
      <label>🤑 who is paying the bill?</label>
      <select onChange={(e) => setPayer(e.target.value)} value={payer}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button> Split Bill</Button>
    </form>
  );
}
