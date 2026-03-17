import Book from '../models/Book.js';
import Member from '../models/Member.js';
import Issue from '../models/Issue.js';

export const getDashboardStats = async (req, res) => {
  try {
    // 1. Basic Stats
    const totalBooks = await Book.countDocuments();
    const totalMembers = await Member.countDocuments();
    const availableBooks = await Book.countDocuments({ quantity: { $gt: 0 } });

    // 2. Fines and Overdue Calculation
    const allIssues = await Issue.find();
    
    // Fines Calculation
    const totalFinesCollected = allIssues.reduce((sum, issue) => sum + (issue.fine || 0), 0);
    
    // Overdue Calculation (status 'Active' and dueDate < today)
    const today = new Date();
    const overdueIssues = allIssues.filter(issue => 
      issue.status === 'Active' && issue.dueDate && new Date(issue.dueDate) < today
    ).length;

    // Currently issued (status = 'Active')
    const issuedBooks = allIssues.filter(issue => issue.status === 'Active').length;

    // 3. Trending Book
    const trending = await Issue.aggregate([
      { $lookup: { from: 'books', localField: 'bookId', foreignField: '_id', as: 'book' } },
      { $unwind: '$book' },
      { $group: { _id: '$book.title', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    
    const trendingBook = trending.length > 0 ? trending[0]._id : 'N/A';

    // 5. Response
    res.status(200).json({
      totalBooks,
      totalMembers,
      availableBooks,
      issuedBooks,
      overdueIssues,
      totalFinesCollected,
      trendingBook
    });
  } catch (error) {
    console.error("Dashboard Controller Error:", error);
    res.status(500).json({ message: "Server error in dashboard stats" });
  }
};