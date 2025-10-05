// Mock data for testing attendees functionality
export const mockGeneralRegistrations = {
  '2025': [
    {
      id: 1,
      title_prefix: 'นาย',
      first_name: 'สมชาย',
      last_name: 'ใจดี',
      email: 'somchai@email.com',
      phone: '081-234-5678',
      organization: 'บริษัท ABC จำกัด',
      education_level: 'ปริญญาตรี',
      created_at: '2024-01-15T10:30:00Z',
      status: 'confirmed',
      checked_in: true,
      check_in_time: '2024-01-20T08:30:00Z',
      check_in_requested: true,
      check_in_request_time: '2024-01-20T08:25:00Z'
    },
    {
      id: 2,
      title_prefix: 'นางสาว',
      first_name: 'วนิดา',
      last_name: 'สวยงาม',
      email: 'wanida@email.com',
      phone: '089-876-5432',
      organization: 'มหาวิทยาลัย XYZ',
      education_level: 'ปริญญาโท',
      created_at: '2024-01-16T14:20:00Z',
      status: 'pending',
      checked_in: false,
      check_in_time: null,
      check_in_requested: false,
      check_in_request_time: null
    },
    {
      id: 3,
      title_prefix: 'นาย',
      first_name: 'ประยุทธ์',
      last_name: 'ขยัน',
      email: 'prayuth@email.com',
      phone: '092-111-2222',
      organization: 'สำนักงานศิลปะ',
      education_level: 'ปริญญาเอก',
      created_at: '2024-01-17T09:15:00Z',
      status: 'confirmed',
      checked_in: false,
      check_in_time: null,
      check_in_requested: true,
      check_in_request_time: '2024-01-20T08:45:00Z'
    },
    {
      id: 4,
      title_prefix: 'ดร.',
      first_name: 'อนุรักษ์',
      last_name: 'วิจัยดี',
      email: 'anurak@university.ac.th',
      phone: '081-999-8888',
      organization: 'มหาวิทยาลัยเทคโนโลยี',
      education_level: 'ปริญญาเอก',
      created_at: '2024-01-18T11:45:00Z',
      status: 'confirmed',
      checked_in: true,
      check_in_time: '2024-01-20T09:15:00Z',
      check_in_requested: true,
      check_in_request_time: '2024-01-20T09:10:00Z'
    },
    {
      id: 5,
      title_prefix: 'คุณ',
      first_name: 'ศิลปิน',
      last_name: 'สร้างสรรค์',
      email: 'silpin@artist.com',
      phone: '094-777-6666',
      organization: 'สตูดิโอศิลปะ',
      education_level: 'ปริญญาตรี',
      created_at: '2024-01-20T16:30:00Z',
      status: 'confirmed',
      checked_in: false,
      check_in_time: null,
      check_in_requested: true,
      check_in_request_time: '2024-01-20T08:45:00Z'
    }
  ],
  '2024': [
    {
      id: 6,
      title_prefix: 'นาย',
      first_name: 'สมศักดิ์',
      last_name: 'ประสบการณ์',
      email: 'somsak@email.com',
      phone: '081-111-1111',
      organization: 'บริษัท DEF จำกัด',
      education_level: 'ปริญญาตรี',
      created_at: '2023-12-15T13:20:00Z',
      status: 'confirmed',
      checked_in: true,
      check_in_time: '2023-12-20T08:00:00Z',
      check_in_requested: true,
      check_in_request_time: '2023-12-20T07:55:00Z'
    },
    {
      id: 7,
      title_prefix: 'ดร.',
      first_name: 'วิทยา',
      last_name: 'งานวิจัย',
      email: 'wittaya@university.ac.th',
      phone: '082-222-2222',
      organization: 'มหาวิทยาลัยราชภัฏ',
      education_level: 'ปริญญาเอก',
      created_at: '2023-12-16T10:45:00Z',
      status: 'confirmed',
      checked_in: true,
      check_in_time: '2023-12-20T09:00:00Z',
      check_in_requested: true,
      check_in_request_time: '2023-12-20T08:55:00Z'
    }
  ]
};

// Mock API response delay
export const mockApiDelay = (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Mock API error simulation
export const mockApiError = (probability = 0.1) => {
  return Math.random() < probability;
}; 