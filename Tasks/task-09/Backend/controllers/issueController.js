import Issue from '../models/Issue.js';
import Book from '../models/Book.js';
import Member from '../models/Member.js';

export const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find({})
      .populate('bookId', 'title')
      .populate('memberId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    // Mapping logic: Check kar rahe hain ki kya book/member exist karte hain
    const formattedIssues = issues.map(issue => ({
      ...issue,
      // Agar populate null ho jaye, toh 'Unknown' show karega
      bookTitle: issue.bookId ? issue.bookId.title : 'Unknown Book',
      memberName: issue.memberId ? issue.memberId.name : 'Unknown Member'
    }));

    res.status(200).json(formattedIssues);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ message: "Record not found" });

    // Agar status 'Active' hai toh hi quantity wapis barhayein
    if (issue.status === 'Active') {
      const book = await Book.findById(issue.bookId);
      if (book) {
        book.quantity += 1;
        await book.save();
      }
    }

    await Issue.findByIdAndDelete(id);
    res.status(200).json({ message: "Transaction record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting record' });
  }
};

export const issueBook = async (req, res) => {
  try {
    const { bookId, memberId } = req.body;
    const book = await Book.findById(bookId);
    
    if (!book || book.quantity <= 0) return res.status(400).json({ message: 'Book unavailable' });
    
    book.quantity -= 1;
    await book.save();
    
    // Status 'Active' set kar rahe hain (Model ke Enum ke mutabiq)
    const newIssue = await Issue.create({ bookId, memberId, status: 'Active' });
    res.status(201).json(newIssue);
  } catch (error) { 
    res.status(500).json({ message: 'Error issuing book' }); 
  }
};

export const returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ message: 'Record not found' });

    // Status 'Returned' mein update aur quantity increment
    if (issue.status === 'Active') {
      issue.status = 'Returned';
      issue.returnDate = Date.now();
      await issue.save();

      const book = await Book.findById(issue.bookId);
      if (book) {
        book.quantity += 1;
        await book.save();
      }
    }
    res.status(200).json({ message: "Book returned successfully" });
  } catch (error) {
    res.status(500).json({ message: 'Error returning book' });
  }
};