import { useNavigate } from "react-router-dom"
import { ArrowRightIcon, HeartIcon, ChatIcon } from "@heroicons/react/outline"

const Card = (props) => {
  const navigate = useNavigate()

  const toDetailedFeed = () => {
    navigate(`/detailedFeed/${props.feedId}`)
  }

  return (
    <div className="p-4 sm:w-1/2 lg:w-1/3">
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
          <p className="leading-relaxed mb-3">{props.desc}</p>
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
              <HeartIcon className="w-4 h-4 mr-1" />
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
