export interface CourseOutcomeItem {
  code: string;
  description: string;
}

export const COURSE_OUTCOMES_MAP: Record<string, CourseOutcomeItem[]> = {
  // 1. Java Programming
  'java-core': [
    { code: 'CO1', description: 'Understand the fundamentals of Java programming, data types, operators, and control statements.' },
    { code: 'CO2', description: 'Apply object-oriented programming concepts such as inheritance, polymorphism, encapsulation, and abstraction.' },
    { code: 'CO3', description: 'Develop Java programs using exception handling, multithreading, and file handling.' },
    { code: 'CO4', description: 'Design and implement Java applications using packages, collections, and other standard libraries.' },
  ],

  // 2. Python Programming
  'python': [
    { code: 'CO1', description: 'Understand Python syntax, data types, operators, and control structures.' },
    { code: 'CO2', description: 'Develop Python programs using functions, modules, and object-oriented programming concepts.' },
    { code: 'CO3', description: 'Apply exception handling, file handling, and built-in data structures to solve programming problems.' },
    { code: 'CO4', description: 'Develop Python applications using suitable libraries for data processing and problem-solving.' },
  ],

  // 3. C and C++ Programming
  'c-cpp': [
    { code: 'CO1', description: 'Understand the fundamentals of C and C++ programming, including data types, operators, and control statements.' },
    { code: 'CO2', description: 'Develop programs using functions, arrays, pointers, structures, and memory management concepts.' },
    { code: 'CO3', description: 'Apply object-oriented programming concepts in C++ to solve computational problems.' },
    { code: 'CO4', description: 'Design and implement programs using file handling, classes, inheritance, and polymorphism.' },
  ],

  // 4. Data Analytics
  'data-analytics': [
    { code: 'CO1', description: 'Understand the fundamental concepts, processes, and applications of data analytics.' },
    { code: 'CO2', description: 'Collect, clean, organize, and preprocess data using appropriate tools and techniques.' },
    { code: 'CO3', description: 'Apply statistical methods and data visualization techniques to analyze datasets.' },
    { code: 'CO4', description: 'Interpret analytical results and generate meaningful insights to support data-driven decision-making.' },
  ],

  // 5. Data Structures and Algorithms (DSA) with Java
  'dsa-java': [
    { code: 'CO1', description: 'Understand fundamental data structures, including arrays, linked lists, stacks, and queues.' },
    { code: 'CO2', description: 'Implement trees, graphs, hashing, and related operations using Java.' },
    { code: 'CO3', description: 'Apply searching, sorting, recursion, and algorithmic techniques to solve computational problems.' },
    { code: 'CO4', description: 'Analyze the time and space complexity of algorithms to select efficient solutions.' },
  ],

  // 6. Data Structures and Algorithms (DSA) with Python
  'dsa-python': [
    { code: 'CO1', description: 'Understand fundamental data structures, including arrays, lists, stacks, queues, and linked lists, using Python.' },
    { code: 'CO2', description: 'Implement trees, graphs, hashing, and associated operations using Python.' },
    { code: 'CO3', description: 'Apply searching, sorting, recursion, and algorithmic techniques to solve programming problems.' },
    { code: 'CO4', description: 'Evaluate the time and space complexity of algorithms to develop efficient solutions.' },
  ],

  // 7. Cloud Computing
  'cloud-computing': [
    { code: 'CO1', description: 'Explain the fundamental concepts, architecture, and characteristics of cloud computing.' },
    { code: 'CO2', description: 'Differentiate cloud service models (IaaS, PaaS, and SaaS) and deployment models.' },
    { code: 'CO3', description: 'Demonstrate the deployment and management of applications and resources using cloud platforms.' },
    { code: 'CO4', description: 'Analyze cloud security, scalability, availability, and cost considerations for selecting suitable cloud solutions.' },
  ],

  // 8. Software Engineering
  'software-engineering': [
    { code: 'CO1', description: 'Explain software engineering principles, software development life cycle models, and process frameworks.' },
    { code: 'CO2', description: 'Analyze software requirements and prepare requirement specifications and use-case models.' },
    { code: 'CO3', description: 'Apply software design principles, modelling techniques, and project planning methods to develop software solutions.' },
    { code: 'CO4', description: 'Evaluate software quality, maintenance, and project management practices for successful software development.' },
  ],

  // 9. Software Testing
  'software-testing': [
    { code: 'CO1', description: 'Explain the fundamentals, principles, objectives, and importance of software testing.' },
    { code: 'CO2', description: 'Apply test case design techniques, including equivalence partitioning and boundary value analysis.' },
    { code: 'CO3', description: 'Perform unit, integration, system, and acceptance testing using appropriate testing methods.' },
    { code: 'CO4', description: 'Analyze test results, document defects, and evaluate software quality using suitable testing tools and techniques.' },
  ],

  // 10. Database Management Systems (DBMS)
  'dbms': [
    { code: 'CO1', description: 'Explain the fundamental concepts, architecture, and functions of database management systems.' },
    { code: 'CO2', description: 'Design relational database schemas using entities, relationships, keys, and normalization techniques.' },
    { code: 'CO3', description: 'Develop SQL queries to create, retrieve, update, and manage data in relational databases.' },
    { code: 'CO4', description: 'Apply transaction management, concurrency control, recovery, and database security concepts to maintain data integrity.' },
  ],
};

// Aliases for slug variations
COURSE_OUTCOMES_MAP['java'] = COURSE_OUTCOMES_MAP['java-core'];
COURSE_OUTCOMES_MAP['java-programming'] = COURSE_OUTCOMES_MAP['java-core'];
COURSE_OUTCOMES_MAP['python-programming'] = COURSE_OUTCOMES_MAP['python'];
COURSE_OUTCOMES_MAP['c-c-programming'] = COURSE_OUTCOMES_MAP['c-cpp'];
COURSE_OUTCOMES_MAP['c-and-c-programming'] = COURSE_OUTCOMES_MAP['c-cpp'];
COURSE_OUTCOMES_MAP['c-programming'] = COURSE_OUTCOMES_MAP['c-cpp'];
COURSE_OUTCOMES_MAP['cpp'] = COURSE_OUTCOMES_MAP['c-cpp'];
COURSE_OUTCOMES_MAP['dsa-with-java'] = COURSE_OUTCOMES_MAP['dsa-java'];
COURSE_OUTCOMES_MAP['dsa-with-python'] = COURSE_OUTCOMES_MAP['dsa-python'];
COURSE_OUTCOMES_MAP['cloud-computing-aws'] = COURSE_OUTCOMES_MAP['cloud-computing'];
COURSE_OUTCOMES_MAP['aws-cloud'] = COURSE_OUTCOMES_MAP['cloud-computing'];
COURSE_OUTCOMES_MAP['database-management-systems'] = COURSE_OUTCOMES_MAP['dbms'];

/**
 * Helper to retrieve Course Outcomes for any course by slug or title.
 */
export function getCourseOutcomes(course: { slug?: string; title?: string }): CourseOutcomeItem[] {
  const slug = (course.slug || '').toLowerCase().trim();
  const title = (course.title || '').toLowerCase().trim();

  if (slug && COURSE_OUTCOMES_MAP[slug]) {
    return COURSE_OUTCOMES_MAP[slug];
  }

  // DSA with Java vs DSA with Python
  if (title.includes('dsa') || slug.includes('dsa')) {
    if (title.includes('python') || slug.includes('python')) {
      return COURSE_OUTCOMES_MAP['dsa-python'];
    }
    return COURSE_OUTCOMES_MAP['dsa-java'];
  }

  // Java
  if (title.includes('java') || slug.includes('java')) {
    return COURSE_OUTCOMES_MAP['java-core'];
  }

  // Python
  if (title.includes('python') || slug.includes('python')) {
    return COURSE_OUTCOMES_MAP['python'];
  }

  // C & C++
  if (title.includes('c++') || title.includes('c & c++') || title.includes('c and c++') || slug.includes('c-cpp') || slug.includes('c-c')) {
    return COURSE_OUTCOMES_MAP['c-cpp'];
  }

  // Data Analytics
  if (title.includes('analytics') || slug.includes('analytics')) {
    return COURSE_OUTCOMES_MAP['data-analytics'];
  }

  // Cloud Computing / AWS
  if (title.includes('cloud') || title.includes('aws') || slug.includes('cloud')) {
    return COURSE_OUTCOMES_MAP['cloud-computing'];
  }

  // Software Testing
  if (title.includes('testing') || slug.includes('testing')) {
    return COURSE_OUTCOMES_MAP['software-testing'];
  }

  // Software Engineering
  if (title.includes('software engineering') || slug.includes('software-engineering')) {
    return COURSE_OUTCOMES_MAP['software-engineering'];
  }

  // DBMS
  if (title.includes('dbms') || title.includes('database') || slug.includes('dbms')) {
    return COURSE_OUTCOMES_MAP['dbms'];
  }

  // Default fallback for any custom course added dynamically
  const courseName = course.title || 'Course';
  return [
    { code: 'CO1', description: `Understand the foundational principles, core architecture, and standard workflows of ${courseName}.` },
    { code: 'CO2', description: `Apply practical techniques, tools, and methodologies to build functional solutions in ${courseName}.` },
    { code: 'CO3', description: `Develop problem-solving capabilities, troubleshooting skills, and production-ready applications.` },
    { code: 'CO4', description: `Evaluate performance, implement industry standards, and deliver high-impact technical outcomes.` },
  ];
}
