import Member from '../models/Member.js';

export const getMembers = async (req, res) => {
  try {
    const members = await Member.find({});
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { memberId, name, department, contact } = req.body;
    const memberExists = await Member.findOne({ memberId });
    if (memberExists) {
      return res.status(400).json({ message: 'Member with this ID already exists' });
    }

    const member = new Member({ memberId, name, department, contact });
    await member.save();
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department, contact } = req.body;
    
    const member = await Member.findById(id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    
    member.name = name || member.name;
    member.department = department || member.department;
    member.contact = contact || member.contact;
    
    await member.save();
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findByIdAndDelete(id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    
    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};