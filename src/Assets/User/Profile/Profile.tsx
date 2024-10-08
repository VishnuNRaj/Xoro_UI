import { ModeToggle } from "@/App"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageCircle, UserPlus } from "lucide-react"

export default function ProfileComponent() {

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            <Card className="max-w-4xl mx-auto rounded-none sm:rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800">
                <div className="relative h-48 sm:h-64 md:h-80">
                    <img
                        alt="Profile banner"
                        className="w-full h-full rounded-md object-cover"
                        src="https://media.cnn.com/api/v1/images/stellar/prod/230621042149-01-cristiano-ronaldo-euro-200-apps-062023-restricted.jpg?c=original"
                    />
                    <div className="absolute top-4 right-4">
                        <ModeToggle />
                    </div>
                </div>
                <div className="relative px-4 sm:px-6 pb-4">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-20 sm:-mt-24 mb-4 sm:mb-0">
                        <img
                            alt="Profile picture"
                            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg"
                            src="https://images1.wionews.com/images/wion/900x1600/2024/7/25/1721918981406_CristianoRonaldo2.jpg"
                        />
                        <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left flex-grow">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Jane Doe</h1>
                            <p className="text-primary-dark dark:text-primary-light">@janedoe</p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex gap-2">
                            <Button variant="outline" size="sm" className="text-secondary-dark dark:text-secondary-light border-secondary-dark dark:border-secondary-light hover:bg-secondary-light/10 dark:hover:bg-secondary-dark/10">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Message
                            </Button>
                            <Button size="sm" className="bg-primary hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary text-white">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Follow
                            </Button>
                        </div>
                    </div>
                    <div className="mt-6">
                        <p className="text-gray-700 dark:text-gray-300">
                            Passionate photographer and nature enthusiast. Capturing the beauty of the world one click at a time.
                            Love to travel and explore new places. Always looking for the next adventure!
                        </p>
                    </div>
                    <div className="mt-6 flex justify-between text-center border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div>
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">1,234</p>
                            <p className="text-gray-600 dark:text-gray-400">Posts</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">5.6K</p>
                            <p className="text-gray-600 dark:text-gray-400">Followers</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">789</p>
                            <p className="text-gray-600 dark:text-gray-400">Following</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}