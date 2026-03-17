import Book from '../models/Book.js'; 

// Get all books
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add a new book
export const addBook = async (req, res) => {
  try {
    const { bookId, title, author, category, quantity } = req.body;
    const bookExists = await Book.findOne({ bookId });
    if (bookExists) {
      return res.status(400).json({ message: 'Book with this ID already exists' });
    }

    const availabilityStatus = quantity > 0;
    
    const book = new Book({ bookId, title, author, category, quantity, availabilityStatus });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a book
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, category, quantity } = req.body;
    
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    
    book.title = title || book.title;
    book.author = author || book.author;
    book.category = category || book.category;
    
    if (quantity !== undefined) {
      book.quantity = Number(quantity);
      book.availabilityStatus = book.quantity > 0;
    }
    
    await book.save();
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a book
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};