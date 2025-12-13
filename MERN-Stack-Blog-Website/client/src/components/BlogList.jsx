import React, { useState } from "react";
import { blog_data, blogCategories } from "../assets/assets";
import { motion } from "motion/react";
import BlogCard from "./BlogCard";

const BlogList = () => {
  const [menu, setMenu] = useState("All");

  return (
    <div>
      <div className="flex justify-center gap-4 sm:gap-8 my-10 relative">
        {blogCategories.map((category, index) => (
          <div key={index} className="relative">
            <button
              onClick={() => setMenu(category)}
              className={`${
                menu === category && "text-white px-4 pt-0.5"
              } cursor-pointer text-gray-500`}
            >
              {category}
              {menu === category && (
                <motion.div
                  layoutId="underline"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute h-7 top-0  bg-primary left-0 right-0 -z-1 rounded-full"
                ></motion.div>
              )}
            </button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40">
        {blog_data
          .filter((blog) => (menu === "All" ? true : blog.category === menu))
          .map((blog) => (
            <BlogCard blog={blog} />
          ))}
      </div>
    </div>
  );
};

export default BlogList;
