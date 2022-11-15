import { useNavigate } from "react-router-dom"
import { ArrowRightIcon, HeartIcon, ChatIcon } from "@heroicons/react/outline"

const Card = (props) => {
  const navigate = useNavigate()

  const toDetailedFeed = () => {
    navigate(`/detailedFeed/${props.feedId}`)
  }

  return (
    <div className="p-4 sm:w-1/2 lg:w-1/2">
      <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
        <img
          className="lg:h-72 md:h-48 w-full object-cover object-center"
          src={props.imageSrc}
          alt="feedImage"
        />
        <div className="p-6 hover:bg-indigo-600 hover:text-white transition duration-300 ease-in">
          <h2 className="text-base font-medium text-indigo-300 mb-1">
            {props.location}
          </h2>
          <h1 className="text-2xl font-semibold mb-3">{props.title}</h1>
          <p className="leading-relaxed mb-3 truncate">{props.desc}</p>
          <div className="flex items-center flex-wrap cursor-pointer">
            <button
              className="text-indigo-300 inline-flex items-center md:mb-2 lg:mb-0"
              onClick={() => {
                toDetailedFeed()
              }}
            >
              Read More
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </button>

            <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
              {props.like ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-6 h-6 fill-red-500"
                >
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              ) : (
                <HeartIcon className="w-4 h-4 mr-1" />
              )}

              {props.liked}
            </span>
            <span className="text-gray-400 inline-flex items-center leading-none text-sm">
              <ChatIcon className="w-4 h-4 mr-1" />
              {props.reply}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
