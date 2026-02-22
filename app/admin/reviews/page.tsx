'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Search, Trash2, Eye, EyeOff, Star, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface Review {
    id: string;
    rating: number;
    comment: string;
    is_verified_purchase: boolean;
    is_featured: boolean;
    is_hidden: boolean;
    admin_reply: string | null;
    created_at: string;
    user: {
        name: string;
        email: string;
    } | null;
    product: {
        name: string;
        slug: string;
        image: string[];
    } | null;
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Reply Dialog State
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [replyText, setReplyText] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [page, refreshTrigger]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/reviews?page=${page}&limit=10`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch reviews');
            }

            if (data.reviews) {
                setReviews(data.reviews);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error: any) {
            console.error('Failed to fetch reviews:', error);
            toast.error(error.message || 'Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, updates: Partial<Review>) => {
        try {
            const res = await fetch(`/api/admin/reviews/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });

            if (!res.ok) throw new Error('Failed to update');

            toast.success('Review updated successfully');
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            toast.error('Failed to update review status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) return;

        try {
            const res = await fetch(`/api/admin/reviews/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete');

            toast.success('Review deleted successfully');
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            toast.error('Failed to delete review');
        }
    };

    const handleReplySubmit = async () => {
        if (!selectedReview) return;

        try {
            setSubmitting(true);
            const res = await fetch(`/api/admin/reviews/${selectedReview.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ admin_reply: replyText }),
            });

            if (!res.ok) throw new Error('Failed to submit reply');

            toast.success('Reply submitted successfully');
            setIsDialogOpen(false);
            setRefreshTrigger(prev => prev + 1);
            setReplyText('');
            setSelectedReview(null);
        } catch (error) {
            toast.error('Failed to submit reply');
        } finally {
            setSubmitting(false);
        }
    };

    const openReplyDialog = (review: Review) => {
        setSelectedReview(review);
        setReplyText(review.admin_reply || '');
        setIsDialogOpen(true);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Customer Reviews</h1>
                    <p className="text-muted-foreground">Manage and respond to product reviews.</p>
                </div>
            </div>

            <div className="bg-white rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Review</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : reviews.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No reviews found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            reviews.map((review) => (
                                <TableRow key={review.id} className={review.is_hidden ? 'bg-gray-50 opacity-60' : ''}>
                                    <TableCell>
                                        <div className="font-medium">{review.user?.name || 'Unknown'}</div>
                                        <div className="text-xs text-muted-foreground">{review.user?.email}</div>
                                        {review.is_verified_purchase && (
                                            <Badge variant="secondary" className="mt-1 text-[10px] bg-green-100 text-green-800 hover:bg-green-100">
                                                Verified Buyer
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-sm truncate max-w-[150px]" title={review.product?.name}>
                                            {review.product?.name || 'Unknown Product'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-yellow-500">
                                            {review.rating} <Star className="h-3 w-3 ml-1 fill-current" />
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {format(new Date(review.created_at), 'MMM d, yyyy')}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-md">
                                        <div className="text-sm line-clamp-2" title={review.comment}>
                                            {review.comment}
                                        </div>
                                        {review.admin_reply && (
                                            <div className="mt-2 text-xs bg-blue-50 p-2 rounded border border-blue-100 text-blue-800">
                                                <span className="font-semibold block mb-1">Reply:</span>
                                                {review.admin_reply}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {review.is_hidden && <Badge variant="destructive" className="w-fit">Hidden</Badge>}
                                            {review.is_featured && <Badge className="bg-amber-500 hover:bg-amber-600 w-fit">Featured</Badge>}
                                            {!review.is_hidden && !review.is_featured && <Badge variant="outline" className="w-fit">Public</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openReplyDialog(review)}
                                                title="Reply"
                                            >
                                                <MessageSquare className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleStatusUpdate(review.id, { is_hidden: !review.is_hidden })}
                                                title={review.is_hidden ? "Show Review" : "Hide Review"}
                                            >
                                                {review.is_hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleStatusUpdate(review.id, { is_featured: !review.is_featured })}
                                                title={review.is_featured ? "Remove from Featured" : "Feature on Homepage"}
                                                className={review.is_featured ? "text-amber-500 hover:text-amber-600" : "text-gray-400 hover:text-amber-500"}
                                            >
                                                <Star className={`h-4 w-4 ${review.is_featured ? 'fill-current' : ''}`} />
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => handleDelete(review.id)}
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination controls could go here */}

            {/* Reply Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reply to Review</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="bg-muted/50 p-4 rounded-md text-sm italic">
                            "{selectedReview?.comment}"
                        </div>
                        <div className="space-y-2">
                            <Label>Your Reply</Label>
                            <Textarea
                                placeholder="Thank you for your feedback..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={4}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleReplySubmit} disabled={submitting}>
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Save Reply
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
