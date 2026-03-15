import User from "../models/User.js";
import Doctor from "../models/Doctor.js";

// @route   GET /api/admin/patients
// @desc    Fetch all users whose role is "patient"
// @access  Admin
export const getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }).select("-password");
    console.log("Patients retrieved successfully");
    res.status(200).json({ success: true, data: patients });
  } catch (error) {
    console.error("Error fetching patients:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   GET /api/admin/doctors
// @desc    Fetch all users whose role is "doctor"
// @access  Admin
export const getDoctors = async (req, res) => {
  try {

    const doctors = await Doctor.find({ approved_by_admin: true })
      .populate("user_id", "-password")
      .populate("hospitals");

    console.log("Doctors retrieved successfully");

    res.status(200).json({
      success: true,
      data: doctors
    });

  } catch (error) {

    console.error("Error fetching doctors:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};

// @route   GET /api/admin/pending-doctors
// @desc    Fetch all users whose role is "doctor" and approval is pending
// @access  Admin


export const getPendingDoctors = async (req, res) => {
  try {

    const pendingDoctors = await Doctor.find({ approved_by_admin: false })
      .populate("user_id", "-password")
      .populate("hospitals");

    console.log("Pending doctors retrieved successfully");

    res.status(200).json({
      success: true,
      data: pendingDoctors
    });

  } catch (error) {

    console.error("Error fetching pending doctors:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};

// @route   PUT /api/admin/approve-doctor/:id
// @desc    Admin approves a doctor
// @access  Admin
export const approveDoctor = async (req, res) => {
  try {

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { approved_by_admin: true },
      { new: true }
    ).populate("user_id", "-password");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    console.log(`Doctor ${doctor._id} approved`);

    res.status(200).json({
      success: true,
      message: "Doctor approved successfully",
      data: doctor
    });

  } catch (error) {

    console.error("Error approving doctor:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};

// @route   DELETE /api/admin/reject-doctor/:id
// @desc    Admin rejects or removes a doctor
// @access  Admin

export const rejectDoctor = async (req, res) => {
  try {

    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    await Doctor.findByIdAndDelete(req.params.id);

    console.log(`Doctor ${req.params.id} rejected and removed`);

    res.status(200).json({
      success: true,
      message: "Doctor rejected and removed successfully"
    });

  } catch (error) {

    console.error("Error rejecting doctor:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};