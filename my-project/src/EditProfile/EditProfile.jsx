import React from "react";

function EditProfile() {
  return (
    <div class="bg-indigo-950 absolute flex items-center justify-center w-screen h-screen font-sans">
      <div class="container bg-orange-400 rounded-lg shadow-lg">
        <div class="flex justify-center gap-4 p-10 py-20 items-start">
          <div class="flex flex-col px-5 justify-center items-start mb-5">
            <img
              src="https://images.unsplash.com/photo-1549298916-f52d724204b4?q=80&w=1713&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Profile Picture"
              class="rounded-full aspect-square w-40 object-cover mb-5 mr-4"
            />
            <div>
              <p class="font-semibold text-left text-gray-700">John Doe</p>
              <p class="text-gray-600">support@profilepress.net</p>
            </div>
          </div>
          <div class="flex px-5 flex-col w-screen text-left gap-6">
            <h2 class="text-3xl font-bold text-gray-800 mb-6">
              Account Settings
            </h2>
            <div>
              <label for="email" class="block text-gray-700 font-bold mb-2">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label for="firstName" class="block text-gray-700 font-bold mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label for="website" class="block text-gray-700 font-bold mb-2">
                Last Name
              </label>
              <input
                type="url"
                id="website"
                name="website"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your website URL"
              />
            </div>

            <div>
              <label for="facebook" class="block text-gray-700 font-bold mb-2">
                Address
              </label>
              <input
                type="url"
                id="facebook"
                name="facebook"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your complete address"
              />
            </div>

           
            <div class="mt-6">
              <button class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
