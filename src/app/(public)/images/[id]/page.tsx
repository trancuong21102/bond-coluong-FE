"use client"
import {
  useGetPublicImageById,
  useGetPublicCategoryImages,
  type ImageModel,
  useGetSavedImageIds,
  useSaveImage,
  useUnsaveImage,
  useGetFollowStatus,
  useFollowUser,
  useUnfollowUser,
  useGetComments,
  useCreateComment,
  useDeleteComment
} from "@/store/api"
import { notFound, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ImageCard } from "@/components/pinterest/ImageCard"
import MasonryGrid from "@/components/ui/grid"
import { use, useState } from "react"
import useAuthStore from "@/lib/store/authStore"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ImageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: response, isLoading, isError } = useGetPublicImageById(id)
  const image = response?.data

  const { isAuthenticated } = useAuthStore()
  const { data: savedIdsResponse } = useGetSavedImageIds({ enabled: isAuthenticated })
  const savedIds = savedIdsResponse?.data ?? []
  const isSaved = savedIds.includes(Number(id))

  const { mutate: saveImage, isPending: saving } = useSaveImage()
  const { mutate: unsaveImage, isPending: unsaving } = useUnsaveImage()

  // Follow
  const authorId = image?.uploadedById
  const { data: followStatusResponse } = useGetFollowStatus(authorId)
  const isFollowing = followStatusResponse?.data?.isFollowing ?? false
  const { mutate: followUser, isPending: following } = useFollowUser()
  const { mutate: unfollowUser, isPending: unfollowing } = useUnfollowUser()

  // Comments
  const { data: commentsResponse, isLoading: loadingComments } = useGetComments(Number(id))
  const comments = commentsResponse?.data ?? []
  const { mutate: createComment, isPending: commenting } = useCreateComment()
  const { mutate: deleteComment, isPending: deletingComment } = useDeleteComment()
  const [commentText, setCommentText] = useState("")
  const { user } = useAuthStore()
  const handleSave = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để lưu hình ảnh")
      router.push("/login")
      return
    }

    if (isSaved) {
      unsaveImage(id, {
        onSuccess: () => toast.success("Đã bỏ lưu ảnh"),
        onError: () => toast.error("Không thể bỏ lưu ảnh"),
      })
    } else {
      saveImage(id, {
        onSuccess: () => toast.success("Lưu ảnh thành công"),
        onError: () => toast.error("Không thể lưu ảnh"),
      })
    }
  }

  const handleFollowToggle = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để theo dõi")
      router.push("/login")
      return
    }
    if (!authorId) return

    if (isFollowing) {
      unfollowUser(authorId, {
        onSuccess: () => toast.success("Đã bỏ theo dõi"),
        onError: () => toast.error("Không thể bỏ theo dõi"),
      })
    } else {
      followUser(authorId, {
        onSuccess: () => toast.success("Đã theo dõi"),
        onError: () => toast.error("Không thể theo dõi"),
      })
    }
  }

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để bình luận")
      router.push("/login")
      return
    }
    if (!commentText.trim()) return

    createComment(
      { imageId: Number(id), content: commentText },
      {
        onSuccess: () => {
          setCommentText("")
        },
        onError: () => {
          toast.error("Không thể đăng bình luận")
        },
      }
    )
  }

  const handleDeleteComment = (commentId: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
      deleteComment(commentId, {
        onSuccess: () => toast.success("Đã xóa bình luận"),
        onError: () => toast.error("Không thể xóa bình luận"),
      })
    }
  }

  // Fetch related images from the same category
  const categorySlug = image?.category?.slug ?? ""
  const { data: relatedResponse, isLoading: loadingRelated } = useGetPublicCategoryImages(categorySlug)
  const relatedImages = (relatedResponse?.data ?? []).filter((img: ImageModel) => img.id !== id)
  if (isError) notFound()

  return (
    <main className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)]">
      {/* ── Left Panel: fixed, scrollable ── */}
      <div className="w-full md:w-[480px] lg:w-[600px] shrink-0 md:h-full md:overflow-y-auto border-b md:border-b-0 md:border-r border-hairline bg-canvas">
        {/* Back button */}
        <div className="sticky top-0 z-10 bg-canvas/80 backdrop-blur-sm px-4 pt-4 pb-2">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-surface-card hover:bg-secondary-pressed transition-colors flex items-center justify-center"
            aria-label="Go back"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="px-4 pb-8 space-y-4 animate-pulse">
            <div className="w-full aspect-[4/5] bg-surface-card rounded-[24px]" />
            <div className="h-8 bg-surface-card rounded-[12px] w-3/4" />
            <div className="h-4 bg-surface-card rounded-[12px] w-full" />
            <div className="h-4 bg-surface-card rounded-[12px] w-2/3" />
          </div>
        ) : image && (
          <div className="px-4 pb-8">
            {/* Main Image */}
            <div className="relative rounded-[24px] overflow-hidden bg-surface-card mb-6">
              <Image
                src={image.imageUrl}
                alt={image.title}
                width={image.width ?? 800}
                height={image.height ?? 600}
                sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1024px) 480px, 600px"
                className="w-full h-auto object-cover"
                priority
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                {/* Download */}
                <button className="w-10 h-10 rounded-full bg-surface-card hover:bg-secondary-pressed transition-colors flex items-center justify-center" aria-label="Download">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" x2="12" y1="15" y2="3"/>
                  </svg>
                </button>
                {/* Share */}
                <button className="w-10 h-10 rounded-full bg-surface-card hover:bg-secondary-pressed transition-colors flex items-center justify-center" aria-label="Share">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/>
                    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
                  </svg>
                </button>
                {/* More */}
                <button className="w-10 h-10 rounded-full bg-surface-card hover:bg-secondary-pressed transition-colors flex items-center justify-center" aria-label="More options">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>
                  </svg>
                </button>
              </div>
              <Button
                variant={isSaved ? "secondary" : "primary"}
                className="rounded-full px-6 font-bold"
                onClick={handleSave}
                disabled={saving || unsaving}
              >
                {isSaved ? "Đã lưu" : "Lưu"}
              </Button>
            </div>

            {/* Title */}
            <h1 className="text-heading-xl text-ink font-bold mb-3 leading-tight">{image.title}</h1>

            {/* Description */}
            {image.description && (
              <p className="text-body-md text-mute mb-5 whitespace-pre-line leading-relaxed">{image.description}</p>
            )}

            {/* Category badge */}
            {image.category?.name && (
              <Link href={`/categories/${image.category.slug || ""}`} className="inline-flex mb-6">
                <span className="text-body-sm font-bold text-ink bg-surface-card px-4 py-1.5 rounded-full hover:bg-secondary-pressed transition-colors border border-hairline">
                  {image.category.name}
                </span>
              </Link>
            )}

            {/* Author */}
            <div className="flex  flex-col justify-between pt-4 border-t border-hairline">
              <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-11 h-11 border border-hairline">
                  <AvatarImage src={image.uploadedBy?.avatar ?? ""} />
                  <AvatarFallback className="bg-surface-card text-body-strong font-bold text-ash">
                    {image.uploadedBy?.name?.charAt(0) ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-body-strong text-ink">{image.uploadedBy?.name}</p>
                  <p className="text-caption-sm text-mute">Tác giả</p>
                </div>
              </div>
              {user?.id !== authorId && (
                <Button 
                  variant={isFollowing ? "secondary" : "primary"} 
                  className="rounded-full text-body-sm font-bold"
                  onClick={handleFollowToggle}
                  disabled={following || unfollowing}
                >
                  {isFollowing ? "Đã theo dõi" : "Theo dõi"}
                </Button>
              )}
            </div>

            {/* Comments List */}
            <div className="mt-6">
              <h3 className="text-body-strong text-ink font-bold mb-4">{comments.length} Nhận xét</h3>
              {loadingComments ? (
                <div className="animate-pulse flex gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-surface-card"></div>
                  <div className="flex-1 h-10 bg-surface-card rounded-md"></div>
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 group">
                      <Avatar className="w-8 h-8 border border-hairline shrink-0">
                        <AvatarImage src={comment.user?.avatar ?? ""} />
                        <AvatarFallback className="bg-surface-card text-caption-sm font-bold">
                          {comment.user?.name?.charAt(0) ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-body-sm font-bold text-ink">{comment.user?.name}</span>
                          <span className="text-caption-sm text-mute">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-body-sm text-ink mt-0.5">{comment.content}</p>
                      </div>
                      {(user?.id === comment.userId || user?.role === 'ADMIN') && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="opacity-0 group-hover:opacity-100 text-mute hover:text-red-500 transition-opacity p-1 h-fit"
                          title="Xóa bình luận"
                          disabled={deletingComment}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-body-sm text-mute mb-3 font-medium">Chưa có nhận xét nào. Hãy là người đầu tiên nhận xét!</p>
              )}
            </div>

            {/* Comment placeholder / Input */}
            <div className="mt-4 pt-4 border-t border-hairline sticky bottom-0 bg-canvas/90 backdrop-blur-sm z-10">
              <form onSubmit={handlePostComment} className="flex items-center gap-2 bg-surface-soft rounded-full px-4 py-2 border border-hairline focus-within:border-primary-base focus-within:ring-1 focus-within:ring-primary-base transition-all">
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarImage src={user?.avatar ?? ""} />
                  <AvatarFallback className="bg-surface-card border border-hairline text-caption-sm font-bold">
                    {user?.name?.charAt(0) ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <input
                  type="text"
                  placeholder="Thêm nhận xét..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={commenting}
                  className="flex-1 bg-transparent text-body-sm text-ink outline-none placeholder:text-mute disabled:opacity-50"
                />
                {commentText.trim() && (
                  <button 
                    type="submit" 
                    disabled={commenting}
                    className="p-1 text-primary-base hover:text-primary-hover disabled:opacity-50"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                )}
              </form>
            </div>
          </div>
          </div>
        )}
      </div>

      {/* ── Right Panel: related images masonry ── */}
      <div className="w-full md:flex-1 md:h-full md:overflow-y-auto px-4 sm:px-6 pt-6 pb-16 bg-canvas">
        {loadingRelated && (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="mb-4 break-inside-avoid rounded-[16px] bg-surface-card animate-pulse"
                style={{ height: `${180 + (i % 3) * 60}px` }}
              />
            ))}
          </div>
        )}

        {!loadingRelated && relatedImages.length > 0 && (
          <>
            <p className="text-body-sm text-mute font-medium mb-5 uppercase tracking-wide">
              Hình ảnh liên quan • {image?.category?.name}
            </p>
            <MasonryGrid
              items={relatedImages}
              renderItem={(img: ImageModel) => (
                <ImageCard
                  key={img.id}
                  id={img.id}
                  title={img.title}
                  imageUrl={img.imageUrl}
                  category={img.category?.name}
                  categorySlug={img.category?.slug}
                  authorName={img.uploadedBy?.name}
                  authorAvatar={img.uploadedBy?.avatar ?? undefined}
                  width={img.width ?? 800}
                  height={img.height ?? 600}
                  sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1024px) calc((100vw - 3rem) / 2), (max-width: 1280px) calc((100vw - 520px) / 3), calc((100vw - 560px) / 4)"
                />
              )}
            />
          </>
        )}

        {!loadingRelated && relatedImages.length === 0 && !isLoading && (
          <div className="flex min-h-80 flex-col items-center justify-center text-center py-24 md:h-full">
            <p className="text-heading-md text-mute mb-2">Chưa có hình ảnh liên quan</p>
            <p className="text-body-md text-mute">Hãy là người đầu tiên đăng tải!</p>
          </div>
        )}
      </div>
    </main>
  )
}
