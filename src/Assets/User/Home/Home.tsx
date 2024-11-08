import { useRef, useEffect } from "react";
import PostShowComponent from "./PostShowComponent";
import InfiniteScroll from "react-infinite-scroll-component";
import ChatLoader from "@/Assets/ChatLoader";
import Preloader from "../../Preloader";
import { useEssentials } from "@/Hooks/useEssentials";
import usePosts from "@/Hooks/User/Home/usePosts";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  MotionValue,
  useInView,
} from "framer-motion";
import { PostImage } from "@/Store/UserStore/Post-Management/Interfaces";

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

function PostWrapper({ post, index }: { post: PostImage; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  //@ts-ignore
  const y = useParallax(scrollYProgress, 50);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative"
      style={{ scrollbarWidth: "none" }}
    >
      <PostShowComponent postData={post} />
    </motion.div>
  );
}

export default function HomeComponent() {
  const { auth } = useEssentials();
  const { post, noMore, skipping } = usePosts();
  const { loading } = auth;
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      style={{ scrollbarWidth: "none" }}
      className="h-screen bg-transparent flex flex-col"
    >
      {loading && <Preloader />}
      {post.length === 0 && <Preloader />}
      <div
        className="flex-grow overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
        ref={scrollRef}
      >
        <div className="w-full flex px-4">
          <div className="flex flex-col gap-8 w-full">
            {!noMore && post.length > 8 ? (
              <InfiniteScroll
                hasMore={!noMore}
                next={skipping}
                loader={<ChatLoader />}
                dataLength={post.length}
                scrollableTarget={scrollRef.current}
                style={{ scrollbarWidth: "none" }}
              >
                {post &&
                  post.length > 0 &&
                  post.map((item, index) => (
                    <PostWrapper key={item._id} post={item} index={index} />
                  ))}
              </InfiniteScroll>
            ) : (
              <>
                {post &&
                  post.length > 0 &&
                  post.map((item, index) => (
                    <PostWrapper key={item._id} post={item} index={index} />
                  ))}
              </>
            )}
          </div>
        </div>
      </div>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50"
        style={{ scaleX, transformOrigin: "0%" }}
      />
    </div>
  );
}
