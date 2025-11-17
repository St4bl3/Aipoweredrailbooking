import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Star,
  ThumbsUp,
  MessageSquare,
  Award,
  Send,
  TrendingUp,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";

export function CommunityPage() {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: "Amit Kumar",
      avatar: "AK",
      train: "Rajdhani Express #12345",
      route: "New Delhi → Mumbai",
      rating: 5,
      date: "2 days ago",
      comment:
        "Excellent service! The train was punctual and the AC coach was very comfortable. Food quality was also good.",
      likes: 24,
      helpful: true,
      replies: [] as any[],
    },
    {
      id: 2,
      user: "Priya Mehta",
      avatar: "PM",
      train: "Shatabdi Express #12346",
      route: "Chennai → Bangalore",
      rating: 4,
      date: "5 days ago",
      comment:
        "Good experience overall. Train was clean but had a 20-minute delay. Staff was helpful.",
      likes: 18,
      helpful: true,
      replies: [] as any[],
    },
    {
      id: 3,
      user: "Rajesh Patel",
      avatar: "RP",
      train: "Duronto Express #12347",
      route: "Kolkata → New Delhi",
      rating: 5,
      date: "1 week ago",
      comment:
        "Fantastic journey! The new coaches are amazing with charging points at every berth. Highly recommend!",
      likes: 31,
      helpful: true,
      replies: [] as any[],
    },
  ]);

  const [showReplyInput, setShowReplyInput] = useState<
    number | null
  >(null);
  const [replyText, setReplyText] = useState("");
  const [likedReviews, setLikedReviews] = useState<Set<number>>(
    new Set(),
  );

  const topContributors = [
    {
      name: "Amit Kumar",
      reviews: 45,
      points: 2250,
      badge: "Gold",
    },
    {
      name: "Priya Mehta",
      reviews: 38,
      points: 1900,
      badge: "Silver",
    },
    {
      name: "Rajesh Patel",
      reviews: 32,
      points: 1600,
      badge: "Silver",
    },
  ];

  const handleLike = (reviewId: number) => {
    setLikedReviews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const handleAddReply = (reviewId: number) => {
    if (!replyText.trim()) return;

    const newReviews = reviews.map((review) => {
      if (review.id === reviewId) {
        return {
          ...review,
          replies: [
            ...review.replies,
            { user: "You", comment: replyText },
          ],
        };
      }
      return review;
    });
    setReviews(newReviews);
    setReplyText("");
    setShowReplyInput(null);
  };

  const handleSubmitReview = () => {
    if (!reviewText.trim() || rating === 0) {
      alert("Please provide a rating and write a review");
      return;
    }

    const newReview = {
      id: reviews.length + 1,
      user: "You",
      avatar: "YU",
      train: "Rajdhani Express #12345",
      route: "New Delhi → Mumbai",
      rating: rating,
      date: "Just now",
      comment: reviewText,
      likes: 0,
      helpful: false,
      replies: [],
    };

    setReviews([newReview, ...reviews]);
    setReviewText("");
    setRating(0);
  };

  return (
    <div className="min-h-screen pb-20 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="mb-2">Community & Reviews</h2>
          <p className="text-muted-foreground">
            Share your experiences and help fellow travelers
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Submit Review */}
            <Card className="p-6">
              <h4 className="mb-4">Share Your Experience</h4>

              <div className="space-y-4">
                <div>
                  <label className="text-sm mb-2 block">
                    Select Train
                  </label>
                  <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                    <option>
                      Recent Journey: Rajdhani Express #12345
                    </option>
                    <option>Shatabdi Express #12346</option>
                    <option>Duronto Express #12347</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm mb-2 block">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {rating > 0
                        ? `${rating} out of 5`
                        : "Select rating"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm mb-2 block">
                    Your Review
                  </label>
                  <Textarea
                    placeholder="Share details about your journey - cleanliness, punctuality, staff behavior, food quality..."
                    rows={4}
                    value={reviewText}
                    onChange={(e) =>
                      setReviewText(e.target.value)
                    }
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    className="gradient-primary text-white border-0"
                    onClick={handleSubmitReview}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Submit Review
                  </Button>
                  <Button variant="outline">Cancel</Button>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    💡 <strong>Earn 50 points</strong> for each
                    verified review! Points can be redeemed for
                    discounts.
                  </p>
                </div>
              </div>
            </Card>

            {/* Reviews List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4>Recent Reviews</h4>
                <select className="h-9 px-3 rounded-md border border-input bg-background text-sm">
                  <option>Most Recent</option>
                  <option>Highest Rated</option>
                  <option>Most Helpful</option>
                </select>
              </div>

              <div className="space-y-4">
                {reviews.map((review, idx) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-all">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full gradient-primary text-white flex items-center justify-center flex-shrink-0">
                          {review.avatar}
                        </div>

                        <div className="flex-1">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p>{review.user}</p>
                              <p className="text-sm text-muted-foreground">
                                {review.train}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {review.route} • {review.date}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Comment */}
                          <p className="text-sm mb-4">
                            {review.comment}
                          </p>

                          {/* Actions */}
                          <div className="flex items-center gap-4">
                            <button
                              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() =>
                                handleLike(review.id)
                              }
                            >
                              <ThumbsUp className="h-4 w-4" />
                              <span>
                                {likedReviews.has(review.id)
                                  ? review.likes + 1
                                  : review.likes}{" "}
                                helpful
                              </span>
                            </button>
                            <button
                              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() =>
                                setShowReplyInput(review.id)
                              }
                            >
                              <MessageSquare className="h-4 w-4" />
                              <span>Reply</span>
                            </button>
                          </div>

                          {/* Replies */}
                          <AnimatePresence>
                            {showReplyInput === review.id && (
                              <motion.div
                                key="reply-input"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="mt-4">
                                  <Input
                                    placeholder="Add a reply..."
                                    value={replyText}
                                    onChange={(e) =>
                                      setReplyText(
                                        e.target.value,
                                      )
                                    }
                                  />
                                  <Button
                                    className="mt-2"
                                    onClick={() =>
                                      handleAddReply(review.id)
                                    }
                                  >
                                    Add Reply
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {review.replies.map(
                            (reply, replyIdx) => (
                              <div
                                key={replyIdx}
                                className="mt-4"
                              >
                                <p className="text-sm font-bold">
                                  {reply.user}
                                </p>
                                <p className="text-sm">
                                  {reply.comment}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Loyalty Progress */}
            <Card className="p-6 gradient-accent text-white border-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm opacity-90 text-white">
                    Your Points
                  </p>
                  <h4>2,450</h4>
                </div>
              </div>

              <Separator className="my-4 bg-white/20" />

              <div className="space-y-3 text-white dark:text-white">
                <div className="flex justify-between text-sm text-white dark:text-white">
                  <span>Progress to Next Tier</span>
                  <span>65%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full text-white dark:text-white"
                    style={{ width: "65%" }}
                  />
                </div>
                <p className="text-xs opacity-75">
                  850 more points to unlock Platinum benefits
                </p>
              </div>

              <Button
                variant="secondary"
                className="w-full mt-4"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                View Rewards
              </Button>
            </Card>

            {/* Top Contributors */}
            <Card className="p-6">
              <h5 className="mb-4">Top Contributors</h5>

              <div className="space-y-3">
                {topContributors.map((contributor, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white flex items-center justify-center flex-shrink-0 text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        {contributor.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {contributor.reviews} reviews
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs"
                    >
                      {contributor.badge}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Benefits */}
            <Card className="p-6">
              <h5 className="mb-4">Review Benefits</h5>

              <div className="space-y-3">
                {[
                  { points: 50, action: "Write a review" },
                  { points: 100, action: "Photo review" },
                  {
                    points: 25,
                    action: "Helpful vote received",
                  },
                  { points: 200, action: "Train of the Month" },
                ].map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {benefit.action}
                    </span>
                    <Badge variant="secondary">
                      +{benefit.points} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Stats */}
            <Card className="p-6">
              <h5 className="mb-4">Community Stats</h5>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      Total Reviews
                    </span>
                    <span>12,458</span>
                  </div>
                  <Progress value={75} className="h-1" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      Active Members
                    </span>
                    <span>3,892</span>
                  </div>
                  <Progress value={60} className="h-1" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      Points Earned
                    </span>
                    <span>245.5K</span>
                  </div>
                  <Progress value={85} className="h-1" />
                </div>
              </div>
            </Card>

            {/* Guidelines */}
            <Card className="p-4 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
              <h6 className="mb-2 text-amber-900 dark:text-amber-100">
                Review Guidelines
              </h6>
              <ul className="text-xs text-amber-700 dark:text-amber-200 space-y-1">
                <li>• Be honest and respectful</li>
                <li>• Focus on recent experiences</li>
                <li>• Avoid personal information</li>
                <li>• Include constructive feedback</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}