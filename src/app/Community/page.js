"use client";
import React, { useState, useEffect } from "react";
import { db, auth } from "@/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Community() {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [imageData, setImageData] = useState(null);
  const [tags, setTags] = useState("");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("Anonymous");
  const [activeTag, setActiveTag] = useState(null);
  const [sortBy, setSortBy] = useState("Newest");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [expandedThreads, setExpandedThreads] = useState({});
  const [replies, setReplies] = useState({});
  const [replyText, setReplyText] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [isTagPopupOpen, setIsTagPopupOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);


const toggleTag = (tag) => {
  setSelectedTags(prev =>
    prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
  );
};


const removeTag = (tagToRemove) => {
  setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove));
};


  const handleTagPopup = () => {
    setIsTagPopupOpen((prev) => !prev);
  };
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        setUsername(userSnap.exists() ? userSnap.data().username : "Anonymous");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || postContent.trim() === "" || postTitle.trim() === "") return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    let uname = "Anonymous";
    let profilePic = "/defaultprofile.png";

    if (userSnap.exists()) {
      const data = userSnap.data();
      uname = data.username || uname;
      profilePic = data.profilePic || profilePic;
    }

    const tagArray = tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

    await addDoc(collection(db, "forumPosts"), {
      title: postTitle,
      content: postContent,
      tags: tagArray,
      userID: user.uid,
      username: uname,
      profilePic,
      image: imageData || null,
      timestamp: serverTimestamp(),
    });

    setPostTitle("");
    setPostContent("");
    setTags("");
    setImageData(null);
    fetchPosts();
    setIsModalOpen(false);
  };

  const fetchPosts = async () => {
    const querySnapshot = await getDocs(collection(db, "forumPosts"));
    const postsArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(postsArray);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    let sorted = [...posts];
    if (sortBy === "Newest") {
      sorted.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);
    } else if (sortBy === "Oldest") {
      sorted.sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds);
    } else if (sortBy === "Username") {
      sorted.sort((a, b) => a.username.localeCompare(b.username));
    }
    if (activeTag) {
      sorted = sorted.filter((post) => post.tags?.includes(activeTag));
    }
    setFilteredPosts(sorted);
  }, [posts, sortBy, activeTag]);

  const handleDelete = async (postId) => {
    await deleteDoc(doc(db, "forumPosts", postId));
    fetchPosts();
  };

  const handleToggleReplies = (postId) => {
    setExpandedThreads((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleReply = async (postId) => {
    const replyContent = replyText[postId];
    if (!replyContent) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    let uname = "Anonymous";
    let profilePic = "/defaultprofile.png";

    if (userSnap.exists()) {
      const data = userSnap.data();
      uname = data.username || uname;
      profilePic = data.profilePic || profilePic;
    }

    const replyData = {
      content: replyContent,
      username: uname,
      profilePic,
      timestamp: serverTimestamp(),
    };

    const repliesRef = doc(db, "forumPosts", postId);
    await addDoc(collection(repliesRef, "replies"), replyData);

    setReplyText((prev) => ({ ...prev, [postId]: "" }));
    fetchReplies(postId);
  };

  const fetchReplies = async (postId) => {
    const repliesSnapshot = await getDocs(
      collection(doc(db, "forumPosts", postId), "replies")
    );
    const repliesArray = repliesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setReplies((prev) => ({ ...prev, [postId]: repliesArray }));
  };

  useEffect(() => {
    posts.forEach((post) => fetchReplies(post.id));
  }, [posts]);

  const allTags = [...new Set(posts.flatMap((p) => p.tags || []))];

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <main
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom, white, #4b5583)",
        paddingBottom: "2rem",
      }}
    >  
    <div className="flex justify-center mt-8">
                <h1
            className="text-center font-bold"
            style={{
              fontSize: "calc(var(--h3-text-size) + 8px)",
            }}
          >
            Community Posts
          </h1>
          </div>
      <div className="container mx-auto bg-gray-200 rounded-2xl text-body p-8">
        {user && (
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
            >
              Create New Post
            </button>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg w-3/4"> {/* Changed from w-96 to w-3/4 */}
              <h2 className="text-body font-bold mb-4">Post to NoTreble!</h2>
              <input
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Post Title"
                className="w-full p-2 border rounded mb-4"
              />
{/* Existing tag selection list */}
<div style={{ maxHeight: '100px', overflowY: 'auto', border: '1px solid #ccc', padding: '5px', marginBottom: '10px' }}>
  {allTags.map((tag, index) => (
    <button
      key={index}
      onClick={() => toggleTag(tag)}
      style={{
        margin: '3px',
        padding: '5px 10px',
        backgroundColor: selectedTags.includes(tag) ? '#333' : '#eee',
        color: selectedTags.includes(tag) ? '#fff' : '#000',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      {tag}
    </button>
  ))}
</div>

{/* New tag input */}
<input
  type="text"
  value={tags}
  onChange={(e) => setTags(e.target.value)}
  placeholder="Add new tags (comma-separated)"
  style={{
    width: '100%',
    padding: '8px',
    marginTop: '10px',
    marginBottom: '10px',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '5px'
  }}
/>


{/* Display selected tags */}
<div style={{ marginTop: '10px' }}>
  {selectedTags.map((tag, index) => (
    <span key={index} style={{ display: 'inline-block', padding: '5px 10px', margin: '3px', backgroundColor: '#ddd', borderRadius: '5px' }}>
      {tag}
      <button
        onClick={() => removeTag(tag)}
        style={{ marginLeft: '5px', background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        ×
      </button>
    </span>
  ))}
</div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-2 border rounded mb-4"
              />
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Share your query with the NoTreble Community..."
                className="w-full p-2 border rounded mb-4"
                rows="4"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}



        {/* Search and Tag Filter */}
        <div className="flex justify-between mt-6 mb-4 gap-4">
          <input
            type="text"
            placeholder="Search Posts"
            className="w-1/3 p-2 border rounded-lg"
            onChange={(e) => {
              const query = e.target.value.toLowerCase();
              setFilteredPosts(posts.filter((post) => post.title.toLowerCase().includes(query) || post.content.toLowerCase().includes(query)));
            }}
          />
          <div className="flex space-x-2 flex-wrap">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-4 py-1 rounded-full ${
                !activeTag ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}
            >
              All
            </button>
            {allTags.slice(0, 5).map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-1 rounded-full ${
                  activeTag === tag ? "bg-blue-600 text-white" : "bg-gray-300"
                }`}
              >
                #{tag}
              </button>
            ))}
{allTags.length > 5 && (
  <button
    onClick={handleTagPopup}
    className="m-3 px-4 py-1 rounded-full bg-gray-300 text-blue-600"
  >
    ➔ More Tags
  </button>
)}

{isTagPopupOpen && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-8 rounded-lg w-96">
      <h2 className="font-bold mb-4">Tags</h2>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {allTags.slice(5).map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-1 rounded-full ${
              activeTag === tag ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>
      <button
        onClick={handleTagPopup}
        className="mt-4 px-4 py-1 rounded-lg bg-blue-600 text-white"
      >
        Close
      </button>
    </div>
  </div>
)}

          </div>
        </div>

        {/* Posts List */}
        <div className="bg-[#455090] rounded-2xl p-8 text-base">
          {currentPosts.map((post) => (
            <div key={post.id} className="relative bg-white p-4 my-4 rounded-lg shadow-md">
              <div className="flex items-start">
                <img
                  src={post.profilePic || "/defaultprofile.png"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div className="flex-1 leading-[1.5]">
                  <p className="font-bold text-xl">@{post.username || "Anonymous"}</p>
                  <p className="mt-4 mb-4 font-bold text-body">{post.title}</p>
                  <p className="mt-5 mb-5 text-body">{post.content}</p>
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post"
                      className="max-w-full max-h-64 mb-2 rounded"
                    />
                  )}
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-1">
                      {post.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-2xl"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="mt-2 text-gray-600 text-xl">
                    {post.timestamp?.seconds
                      ? new Date(post.timestamp.seconds * 1000).toLocaleString()
                      : "No timestamp"}
                  </p>
                </div>
              </div>

              {user?.uid === post.userID && (
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setMenuOpenId(menuOpenId === post.id ? null : post.id)}
                    className="text-body font-bold"
                  >
                    ⋮
                  </button>
                  {menuOpenId === post.id && (
                    <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-lg z-10">
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => handleToggleReplies(post.id)}
                className="mt-8 text-2xl text-blue-600"
              >
                {expandedThreads[post.id] ? "Hide Replies" : "Show Replies"}
              </button>

              {expandedThreads[post.id] && (
                <div className="mt-4 ml-4 space-y-2">
                  {replies[post.id]?.map((reply) => (
                    <div key={reply.id} className="flex items-start bg-gray-100 p-2 rounded">
                      <img
                        src={reply.profilePic || "/defaultprofile.png"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div className="flex-1">
                        <p className="mb-3 text-xl font-bold">@{reply.username}</p>
                        <p className="mb-3 text-body">{reply.content}</p>
                        <p className="text-md text-gray-500">
                          {reply.timestamp?.seconds
                            ? new Date(reply.timestamp.seconds * 1000).toLocaleString()
                            : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="flex space-x-2 mt-2">
                    <input
                      value={replyText[post.id] || ""}
                      onChange={(e) =>
                        setReplyText((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                      placeholder="Write a reply..."
                      className="flex-1 px-2 py-1 border rounded"
                    />
                    <button
                      onClick={() => handleReply(post.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
          >
            ← Previous
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage * postsPerPage >= filteredPosts.length}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg ml-4"
          >
            Next →
          </button>
        </div>
      </div>
    </main>
  );
}
