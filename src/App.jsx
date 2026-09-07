import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const postsLoaded = useRef(false);
 const [following, setFollowing] = useState(() => {
  const currentUser = JSON.parse(
    localStorage.getItem("postoraUser")
  );

  const savedFollowing = localStorage.getItem(
    "postoraFollowing_" + currentUser?.username
  );

  return savedFollowing ? JSON.parse(savedFollowing) : [];
});
const [followers, setFollowers] = useState(() => {
  const currentUser = JSON.parse(
    localStorage.getItem("postoraUser")
  );

  const savedFollowers = localStorage.getItem(
    "postoraFollowers_" + currentUser?.username
  );

  return savedFollowers ? JSON.parse(savedFollowers) : [];
});

  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(
  localStorage.getItem("postoraLoggedIn") === "true"
);
  const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [showSignup, setShowSignup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  useEffect(() => {
    
  if (showProfile) {
    const currentUser = JSON.parse(
      localStorage.getItem("postoraUser")
    );

    const savedFollowers = localStorage.getItem(
      "postoraFollowers_" + currentUser?.username
    );

    setFollowers(
      savedFollowers ? JSON.parse(savedFollowers) : []
    );
  }
}, [showProfile]);
  const [signupUsername, setSignupUsername] = useState("");
const [signupEmail, setSignupEmail] = useState("");
const [signupPassword, setSignupPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [editingProfile, setEditingProfile] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [posts, setPosts] = useState(() => {
  const savedPosts = localStorage.getItem("postoraPosts");

  if (savedPosts) {
    return JSON.parse(savedPosts);
  }

  return [
    {
      id: 1,
      author: "Arjun",
      username: "@arjun",
      text: "Exploring new ideas and building something amazing today! 🚀",
      likes: 0,
      comments: [],
      showComments: false,
    },
  ];
});


  const [commentText, setCommentText] = useState("");
 useEffect(() => {
  fetch("http://localhost:5000/api/posts")
    .then((response) => response.json())
    .then((data) => {
  if (data.length > 0) {
    setPosts(data);
  }

  postsLoaded.current = true;
})
    .catch((error) => {
      console.error("Error loading posts:", error);
      postsLoaded.current = true;
    });
}, []);
useEffect(() => {
  if (postsLoaded.current) {
    localStorage.setItem("postoraPosts", JSON.stringify(posts));
  }
}, [posts]);


  const addPost = async () => {
  if (postText.trim() !== "" || postImage !== "") {
    const currentUser = JSON.parse(
      localStorage.getItem("postoraUser")
    );

    const newPost = {
      author: currentUser.username,
      username: "@" + currentUser.username,
      text: postText,
      image: postImage,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPost),
        }
      );

      const savedPost = await response.json();

      if (response.ok) {
        setPosts((prevPosts) => [savedPost, ...prevPosts]);
        setPostText("");
        setPostImage("");
      } else {
        alert(savedPost.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Server error");
    }
  }
};
  const likePost = (id) => {
  setPosts(
    posts.map((post) =>
      post.id === id
        ? { ...post, likes: post.likes === 0 ? 1 : 0 }
        : post
    )
  );
};

  const toggleComments = (id) => {
    setPosts(
      posts.map((post) =>
        post.id === id
          ? { ...post, showComments: !post.showComments }
          : post
      )
    );
  };

  const addComment = (id) => {
  if (commentText.trim() !== "") {
    const currentUser = JSON.parse(
  localStorage.getItem("postoraUser")
);

const newComment = {
  author: currentUser.username,
  username: "@" + currentUser.username,
  text: commentText,
};

    setPosts(
      posts.map((post) =>
        post.id === id
          ? {
              ...post,
              comments: [...post.comments, newComment],
            }
          : post
      )
    );

    setCommentText("");
  }
};
const sharePost = async (post) => {
  const shareData = {
    title: "Postora",
    text: `${post.author}: ${post.text}`,
  };

  if (navigator.share) {
    await navigator.share(shareData);
  } else {
    await navigator.clipboard.writeText(shareData.text);
    alert("Post link copied!");
  }
};
const deletePost = (postId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this post?"
  );

  if (confirmDelete) {
    setPosts(
      posts.filter((post) => post.id !== postId)
    );
  }
};

const deleteComment = (postId, commentIndex) => {
  setPosts(
    posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            comments: post.comments.filter(
              (_, index) => index !== commentIndex
            ),
          }
        : post
    )
  );
};
if (!isLoggedIn) {
  if (showSignup) {
  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">P</div>

       <h1 className="postora-logo">Postora</h1>

        <h2>Create Account</h2>

        <p className="login-subtitle">
          Join Postora and start sharing
        </p>

        <input
  type="text"
  placeholder="Choose a username"
  value={signupUsername}
  onChange={(e) => setSignupUsername(e.target.value)}
/>

       <input
  type="email"
  placeholder="Email address"
  value={signupEmail}
  onChange={(e) => setSignupEmail(e.target.value)}
/>

       <input
  type="password"
  placeholder="Create password"
  value={signupPassword}
  onChange={(e) => setSignupPassword(e.target.value)}
/>

        <button
          className="login-button"
          onClick={async () => {
  if (
    signupUsername.trim() === "" ||
    signupEmail.trim() === "" ||
    signupPassword.trim() === ""
  ) {
    alert("Please fill in all fields");
    return;
  }
  console.log("Saving accoumt...");

 const response = await fetch("http://localhost:5000/api/auth/signup", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    username: signupUsername,
    email: signupEmail,
    password: signupPassword,
  }),
});

const data = await response.json();

if (!response.ok) {
  alert(data.message);
  return;
}

const loggedInUser = {
  ...data.user,
  profileImage: "",
  bio: "Hey! I'm new to Postora 👋",
};

localStorage.setItem(
  "postoraUser",
  JSON.stringify(loggedInUser)
);

localStorage.setItem("postoraLoggedIn", "true");

alert("Account created successfully!");
setShowSignup(false);
setIsLoggedIn(true);
}}
        >
          Create Account
        </button>

        <p className="signup-text">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => setShowSignup(false)}
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
}
  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">P</div>

        <h1>Postora</h1>
        <p className="login-tagline">
          Connect. Share. Discover.
        </p>

        <h2>Welcome to Postora👋</h2>
        <p className="login-subtitle">
          Login to continue to your feed
        </p>

        <input
  type="text"
  placeholder="Username or email"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>

       <input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
       <button
  className="login-button"
  onClick={async () => {
    const response = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    username,
    password,
  }),
});

const data = await response.json();

if (!response.ok) {
  alert(data.message);
  return;
}

localStorage.setItem(
  "postoraUser",
  JSON.stringify(data.user)
);

localStorage.setItem("postoraLoggedIn", "true");

setIsLoggedIn(true);

    
  }}
>
  Login
</button>

       <p className="signup-text">
  New to Postora?{" "}
  <button
  type="button"
  onClick={() => setShowSignup(true)}
>
  Create an account
</button>
</p>

      </div>
    </div>
  );
}
if (showProfile) {
  const currentUser = JSON.parse(
    localStorage.getItem("postoraUser")
  );

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">Postora</div>

       <button
  className="back-feed-button"
  onClick={() => setShowProfile(false)}
>
  ← Back to Feed
</button>
      </nav>

      <main className="profile-page">
        <div className="profile-card">
          <div className="profile-avatar">
  {currentUser?.profileImage ? (
    <img
      src={currentUser.profileImage}
      alt="Profile"
    />
  ) : (
    currentUser?.username?.charAt(0).toUpperCase()
  )}
</div>

          <h2>{currentUser?.username}</h2>
          <div className="profile-stats">
  <div>
    <strong>
      {posts.filter(
        (post) => post.username === "@" + currentUser?.username
      ).length}
    </strong>
    <span>Posts</span>
  </div>

  <div>
    <strong>{followers.length}</strong>
    <span>Followers</span>
  </div>

  <div>
    <strong>{following.length}</strong>
    <span>Following</span>
  </div>
</div>

          <p className="profile-bio">
            {currentUser?.bio}
          </p>

         

          <button
  className="edit-profile-button"
  onClick={() => {
  setEditUsername(currentUser?.username || "");
  setEditBio(currentUser?.bio || "");
  setEditingProfile(true);
}}
>
  ✏️ Edit Profile
</button>
{editingProfile && (
  <div className="edit-profile-form">
    <h3>Edit Profile</h3>

   <input
  type="text"
  placeholder="Username"
  value={editUsername}
  onChange={(e) => setEditUsername(e.target.value)}
/>

   <textarea
  placeholder="Bio"
  value={editBio}
  onChange={(e) => setEditBio(e.target.value)}
/>

   <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setProfileImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  }}
/>
<button
  onClick={() => {
    const savedAccounts = JSON.parse(
      localStorage.getItem("postoraAccounts") || "[]"
    );

    const updatedUser = {
      ...currentUser,
      username: editUsername || currentUser.username,
      bio: editBio || currentUser.bio,
      profileImage: profileImage || currentUser.profileImage,
    };

    const updatedAccounts = savedAccounts.map((account) =>
      account.username === currentUser.username
        ? updatedUser
        : account
    );

    localStorage.setItem(
      "postoraAccounts",
      JSON.stringify(updatedAccounts)
    );

    localStorage.setItem(
      "postoraUser",
      JSON.stringify(updatedUser)
    );

    setEditingProfile(false);
    alert("Profile updated successfully!");
  }}
>
  💾 Save Changes
</button>

<button onClick={() => setEditingProfile(false)}>
  Cancel
</button>

  </div>
)}
<div className="profile-posts">
  <h3>My Posts</h3>

  <div className="posts-grid">
    {posts
      .filter(
        (post) =>
          post.username === "@" + currentUser?.username
      )
      .map((post) => (
        <div className="profile-post" key={post.id}>
          {post.image ? (
            <img src={post.image} alt="Post" />
          ) : (
            <div className="text-post">
              {post.text}
            </div>
          )}
        </div>
      ))}
  </div>
</div>
        </div>
      </main>
    </div>
  );
}
  return (
   
    
    <div className="app">
      <nav className="navbar">
        <div className="logo">Postora</div>
        <input
  type="text"
  className="search-bar"
  placeholder="🔍 Search posts or profiles..."
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
/>

        <div className="nav-links">
  <button onClick={() => setShowProfile(true)}>
    👤 Profile
  </button>

  <button
    onClick={() => {
      localStorage.removeItem("postoraLoggedIn");
      setIsLoggedIn(false);
    }}
  >
    Logout
  </button>
</div>
       


        
      </nav>

      <main className="main-content">
  
      
        
        
        <section className="feed">
          
          

          <div className="create-post">
            <div className="avatar">
  {JSON.parse(localStorage.getItem("postoraUser"))?.username?.charAt(0).toUpperCase()}
</div>
<div className="create-post-user">
  @{JSON.parse(localStorage.getItem("postoraUser"))?.username}
</div>
            <input
              type="text"
              placeholder="write a caption..."
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />
            <input
  type="file"
  accept="image/*,video/*"
  onChange={(e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPostImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  }}
/>
{postImage && postImage.startsWith("data:video") ? (
  <video
    src={postImage}
    controls
    className="post-image"
  />
) : (
  postImage && (
    <img
      src={postImage}
      alt="Preview"
      className="post-image"
    />
  )
)}
{postImage && (
  <button onClick={() => setPostImage("")}>
    ❌ Remove
  </button>
)}

            <button className="post-button" onClick={addPost}>
              Post
            </button>
          </div>

          {posts
  .filter((post) =>
    post.text.toLowerCase().includes(searchText.toLowerCase()) ||
    post.author.toLowerCase().includes(searchText.toLowerCase()) ||
    post.username.toLowerCase().includes(searchText.toLowerCase())
  )
  .map((post) => (
            <div className="post-card" key={post.id}>
              <div className="post-header">
                <div className="avatar">
                  {post.author.charAt(0)}
                </div>

                <div>
                  <strong>{post.author}</strong>
                 <button
  className="follow-button"
  onClick={() => {
  const currentUser = JSON.parse(
    localStorage.getItem("postoraUser")
  );

  const isFollowing = following.includes(post.username);

  const updatedFollowing = isFollowing
    ? following.filter((user) => user !== post.username)
    : [...following, post.username];

  setFollowing(updatedFollowing);

  localStorage.setItem(
    "postoraFollowing_" + currentUser.username,
    JSON.stringify(updatedFollowing)
  );

  const targetUsername = post.username.replace("@", "");

  const savedFollowers = JSON.parse(
    localStorage.getItem(
      "postoraFollowers_" + targetUsername
    ) || "[]"
  );

  const updatedFollowers = isFollowing
    ? savedFollowers.filter(
        (user) => user !== currentUser.username
      )
    : [...savedFollowers, currentUser.username];

  localStorage.setItem(
    "postoraFollowers_" + targetUsername,
    JSON.stringify(updatedFollowers)
  );
}}
>
  {following.includes(post.username)
    ? "Following"
    : "Follow"}
</button>
                  <small>{post.username} · just now</small>
                </div>
              </div>

              <p>{post.text}</p>
              {post.image && post.image.startsWith("data:video") ? (
  <video
    src={post.image}
    controls
    className="post-image"
  />
) : (
  post.image && (
    <img
      src={post.image}
      alt="Post"
      className="post-image"
    />
  )
)}
              <div className="post-actions">
                <button onClick={() => likePost(post.id)}>
  {post.likes === 1 ? "❤️ Liked" : "🤍 Like"} 
</button>

                <button onClick={() => toggleComments(post.id)}>
                  💬 Comment {post.comments.length}
                </button>

               <button onClick={() => sharePost(post)}>
  ↗ Share
</button>
                <button onClick={() => deletePost(post.id)}>
  🗑️ Delete
</button>
              </div>

              {post.showComments && (
                <div className="comments-section">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) =>
                      setCommentText(e.target.value)
                    }
                  />

                  <button onClick={() => addComment(post.id)}>
                    Post Comment
                  </button>

                  {post.comments.map((comment, index) => (
  <div key={index} className="comment">
    <div className="avatar">
      {comment.author.charAt(0)}
    </div>

    <div>
      <strong>{comment.author}</strong>
      <small>{comment.username}</small>
      <p>{comment.text}</p>
      <button onClick={() => deleteComment(post.id, index)}>
  🗑️
</button>
    </div>
  </div>
))}
                </div>
              )}
            </div>
          ))}
        </section>

        <aside className="sidebar">
          <h3>Welcome to Postora</h3>
          <p>
            Share your thoughts, connect with people and discover
            new ideas.
          </p>
          
        </aside>
      </main>
    </div>
  );
}

export default App;