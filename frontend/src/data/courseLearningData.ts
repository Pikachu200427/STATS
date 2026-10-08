export interface LessonQuiz {
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
}

export interface LessonContentSection {
  sectionTitle: string;
  paragraphs: string[];
  diagram?: {
    title: string;
    caption: string;
    diagramType?: 'architecture' | 'flow' | 'table';
    svgOrAscii?: string;
  };
  codeSnippet?: {
    filename: string;
    language: string;
    code: string;
    output?: string;
    explanation: string;
  };
  proTip?: string;
  commonMistake?: string;
}

export interface LessonTopic {
  id: string; // e.g. "mod1-top1"
  title: string;
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  objectives: string[];
  sections: LessonContentSection[];
  quiz: LessonQuiz;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  topics: LessonTopic[];
}

export interface CourseLearningCurriculum {
  courseSlug: string;
  courseTitle: string;
  category: string;
  instructor: string;
  estimatedHours: string;
  overview: string;
  prerequisites: string[];
  modules: CourseModule[];
}

export const COURSE_CURRICULA: Record<string, CourseLearningCurriculum> = {
  // ==========================================
  // 1. JAVA CORE & ADVANCED
  // ==========================================
  'java-core': {
    courseSlug: 'java-core',
    courseTitle: 'Java (Core & Advanced)',
    category: 'Backend & Enterprise Systems',
    instructor: 'Sujal Sharma',
    estimatedHours: '40 Hours of Reading & Coding',
    overview: 'A deep-dive, text-and-code mastery track covering the Java Virtual Machine architecture, OOP principles, modern Java 21 features, Collections Framework, Multithreading, and RESTful microservice engineering.',
    prerequisites: ['Basic computer literacy', 'JDK 21 installed locally', 'Text editor or IntelliJ IDEA / VS Code'],
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: JVM Architecture & Java Fundamentals',
        description: 'Understand how the Java Virtual Machine manages memory, Bytecode compilation, JIT compiler, and the class loading lifecycle.',
        topics: [
          {
            id: 'java-jvm-internals',
            title: 'JVM Memory Model: Heap, Stack & Metaspace',
            readTime: '12 min read',
            difficulty: 'Beginner',
            summary: 'Uncover how the JVM executes compiled bytecode, manages stack frames for method calls, and handles heap garbage collection.',
            objectives: [
              'Understand the difference between JVM, JRE, and JDK',
              'Trace how Stack Frames hold local variables and method call states',
              'Learn the generational garbage collection layout in Heap Memory',
              'Explore Metaspace vs old PermGen storage'
            ],
            sections: [
              {
                sectionTitle: 'How Java Code Runs Under The Hood',
                paragraphs: [
                  'When you run javac Main.java, the Java compiler produces bytecode (.class file). This bytecode is not native machine code for x86 or ARM architectures. Instead, it is an instruction set designed specifically for the Java Virtual Machine (JVM).',
                  'When the JVM launches, the ClassLoader subsystem loads the compiled class into memory. The Bytecode Verifier ensures the code adheres to Java security constraints, and then the Execution Engine takes over. The Execution Engine employs both an Interpreter for rapid startup and a Just-In-Time (JIT) compiler (C1/C2) to compile frequently invoked "hot spots" directly into high-speed machine code.'
                ],
                diagram: {
                  title: 'JVM Memory Layout & Runtime Data Areas',
                  caption: 'Stack frames store primitive local variables and object references; actual object instances live inside the Heap.',
                  diagramType: 'architecture',
                  svgOrAscii: `+-------------------------------------------------------------+
|                 JVM RUNTIME DATA AREAS                      |
+------------------------------+------------------------------+
|     HEAP MEMORY (Shared)     |   THREAD STACKS (Per-Thread) |
|  +------------------------+  |  +------------------------+  |
|  | Young Gen (Eden/S0/S1) |  |  | Thread 1: Stack Frame  |  |
|  +------------------------+  |  |  - Local vars (int x)  |  |
|  | Old Gen (Tenured)      |  |  |  - Ref -> Heap obj    |  |
|  +------------------------+  |  +------------------------+  |
|                              |  | Thread 2: Stack Frame  |  |
|   METASPACE (Native Memory)  |  +------------------------+  |
|   - Class metadata & methods |  PC Registers & Native Stacks|
+------------------------------+------------------------------+`
                },
                codeSnippet: {
                  filename: 'MemoryReferenceDemo.java',
                  language: 'java',
                  code: `public class MemoryReferenceDemo {
    public static void main(String[] args) {
        // 'age' primitive resides directly on the Thread Stack Frame
        int age = 22;

        // 'studentName' reference lives on Stack, the String object lives in String Pool inside Heap
        String studentName = new String("Rahul Sharma");

        // Object instance allocated in Heap; 'lead' pointer resides on Stack
        Student lead = new Student("STATS-001", studentName, age);

        System.out.println("Student: " + lead.getStudentId() + " -> " + lead.getName());
    }
}

class Student {
    private final String studentId;
    private final String name;
    private final int age;

    public Student(String studentId, String name, int age) {
        this.studentId = studentId;
        this.name = name;
        this.age = age;
    }
    public String getStudentId() { return studentId; }
    public String getName() { return name; }
}`,
                  output: `Student: STATS-001 -> Rahul Sharma`,
                  explanation: 'Primitives like int age are stored directly in stack frames. Reference variables like lead store a 64-bit or 32-bit compressed address pointing to the heap memory address.'
                },
                proTip: 'In production microservices, use JVM flags such as -XX:+UseG1GC -Xms2g -Xmx2g to avoid stop-the-world garbage collection pauses and avoid heap resizing overhead.',
                commonMistake: 'Never assume objects created in a loop are instantly garbage collected. If a collection retains references to them, a memory leak occurs.'
              }
            ],
            quiz: {
              question: 'Where does an object instance created with the "new" keyword reside in the JVM?',
              options: [
                'Inside the Thread Stack Frame',
                'In the Native PC Register',
                'In Heap Memory',
                'In Metaspace Class Registry'
              ],
              correctAnswer: 2,
              explanation: 'All object instances in Java reside in Heap Memory. Stack frames only hold references (memory pointers) and primitive variables.'
            }
          },
          {
            id: 'java-oop-deep-dive',
            title: 'Object-Oriented Architecture & Polymorphism',
            readTime: '15 min read',
            difficulty: 'Beginner',
            summary: 'Master encapsulation, method overloading vs overriding, virtual method tables (vtable), and composition over inheritance.',
            objectives: [
              'Understand how dynamic method dispatch (vtable) operates in Java',
              'Design modular systems using Interfaces and Abstract Classes',
              'Apply the Composition over Inheritance principle'
            ],
            sections: [
              {
                sectionTitle: 'Dynamic Method Dispatch & Virtual Tables',
                paragraphs: [
                  'Polymorphism allows a subclass to provide a specific implementation of a method that is already provided by its parent class. In Java, all non-static, non-final methods are virtual by default.',
                  'When an overridden method is called through a superclass reference, the JVM uses Dynamic Method Dispatch. At runtime, the JVM looks up the Virtual Method Table (vtable) associated with the actual runtime object class rather than the compile-time variable type.'
                ],
                codeSnippet: {
                  filename: 'PaymentEngine.java',
                  language: 'java',
                  code: `// Interface contract for financial processors
public interface PaymentGateway {
    PaymentReceipt process(double amount);
}

public class UpiGateway implements PaymentGateway {
    private final String vpaId;

    public UpiGateway(String vpaId) {
        this.vpaId = vpaId;
    }

    @Override
    public PaymentReceipt process(double amount) {
        String txId = "UPI-TXN-" + System.currentTimeMillis();
        return new PaymentReceipt(txId, amount, "SUCCESS_UPI");
    }
}

public class PaymentService {
    private final PaymentGateway gateway;

    // Dependency Injection via constructor
    public PaymentService(PaymentGateway gateway) {
        this.gateway = gateway;
    }

    public void checkout(double amount) {
        PaymentReceipt receipt = gateway.process(amount);
        System.out.println("Payment settled: " + receipt.transactionId());
    }
}

record PaymentReceipt(String transactionId, double amount, String status) {}`,
                  output: `Payment settled: UPI-TXN-1728249000123`,
                  explanation: 'By coding to the PaymentGateway interface, PaymentService is loosely coupled. We can swap UPI with CreditCard or NetBanking without altering business logic.'
                },
                proTip: 'Prefer composition over inheritance. Inheritance introduces tight coupling where alterations in the superclass can inadvertently break subclass invariants.',
                commonMistake: 'Avoid hiding fields or overloading methods with confusing parameter types that make compiler resolution ambiguous.'
              }
            ],
            quiz: {
              question: 'Which mechanism enables runtime polymorphism when invoking overridden methods in Java?',
              options: [
                'Static method inlining',
                'Dynamic Method Dispatch via vtable',
                'Type casting during compilation',
                'Garbage Collector sweep phase'
              ],
              correctAnswer: 1,
              explanation: 'The JVM uses dynamic method dispatch and virtual method tables (vtable) to resolve which concrete method implementation to execute at runtime.'
            }
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: Collections Framework & Stream API',
        description: 'Deep dive into ArrayList vs LinkedList, HashMap internal hashing mechanics, tree-based sets, and declarative functional Streams.',
        topics: [
          {
            id: 'java-hashmap-internals',
            title: 'Inside HashMap: Buckets, Collisions & Red-Black Trees',
            readTime: '14 min read',
            difficulty: 'Intermediate',
            summary: 'Learn how HashMap computes bucket indexes, handles collisions with linked nodes, and transforms buckets into Red-Black Trees at TREEIFY_THRESHOLD.',
            objectives: [
              'Understand hash codes, bitwise bucket masking, and capacity resizing',
              'Analyze how collisions are resolved in O(1) average time',
              'Learn why Java 8+ converts linked lists to balanced Red-Black trees'
            ],
            sections: [
              {
                sectionTitle: 'Hashing & Bucket Distribution',
                paragraphs: [
                  'Java HashMap is an array of Node<K,V> buckets. When you put(key, value), the key\'s hashCode() is passed through a supplemental hash function to distribute bits evenly.',
                  'The bucket index is computed as: index = (n - 1) & hash, where n is always a power of two. When two distinct keys land in the same bucket, a hash collision occurs.',
                  'Prior to Java 8, collisions were resolved exclusively using a Singly Linked List (O(n) worst-case search time). Starting with Java 8, when a bucket exceeds 8 entries (TREEIFY_THRESHOLD = 8) and total table capacity is at least 64, the bucket is transformed into a Red-Black Tree (TreeNode<K,V>), improving lookup complexity to O(log n).'
                ],
                diagram: {
                  title: 'HashMap Bucket Structure in Java 8+',
                  caption: 'Buckets with few collisions use singly-linked lists; heavy buckets treeify into Red-Black Trees.',
                  diagramType: 'architecture',
                  svgOrAscii: `[ Bucket Array: Capacity = 16 ]
Index 0 -> null
Index 1 -> [Node: K1, V1] -> [Node: K2, V2] -> null  (Linked List O(k))
Index 2 -> null
Index 3 -> [TreeNode: Root]                          (Red-Black Tree O(log k))
            /          \\
      [TreeNode]    [TreeNode]
Index 4 -> [Node: K3, V3] -> null`
                },
                codeSnippet: {
                  filename: 'CustomKeyDemo.java',
                  language: 'java',
                  code: `import java.util.Objects;

public final class StudentKey {
    private final String rollNumber;
    private final int cohortYear;

    public StudentKey(String rollNumber, int cohortYear) {
        this.rollNumber = rollNumber;
        this.cohortYear = cohortYear;
    }

    // MANDATORY: equals and hashCode contract
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof StudentKey that)) return false;
        return cohortYear == that.cohortYear && 
               Objects.equals(rollNumber, that.rollNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(rollNumber, cohortYear);
    }
}`,
                  output: `Objects with identical rollNumber and cohortYear produce identical hash codes and evaluate to true.`,
                  explanation: 'Whenever you override equals(), you MUST override hashCode(). If two objects are equal according to equals(), they must produce the exact same hashCode.'
                },
                proTip: 'Always initialize HashMap with an estimated capacity: new HashMap<>(expectedSize / 0.75f + 1) to prevent costly table resizing operations in high-throughput applications.',
                commonMistake: 'Using mutable objects as HashMap keys. If a key’s internal state mutates after insertion, its hashCode changes and the entry becomes permanently unreachable.'
              }
            ],
            quiz: {
              question: 'What is the worst-case lookup time in a Java 8+ HashMap when a bucket has treeified?',
              options: [
                'O(1)',
                'O(n)',
                'O(log n)',
                'O(n^2)'
              ],
              correctAnswer: 2,
              explanation: 'In Java 8+, when a bucket exceeds TREEIFY_THRESHOLD (8 entries), it converts into a Red-Black Tree, guaranteeing O(log n) worst-case lookup.'
            }
          },
          {
            id: 'java-stream-api',
            title: 'Functional Pipelines with Java Stream API',
            readTime: '11 min read',
            difficulty: 'Intermediate',
            summary: 'Write declarative data transformations using map, filter, flatMap, groupingBy, and parallel streams.',
            objectives: [
              'Distinguish between Intermediate (lazy) and Terminal (eager) stream operations',
              'Group and summarize complex objects using Collectors.groupingBy',
              'Recognize when to avoid parallelStream() to prevent thread pool starvation'
            ],
            sections: [
              {
                sectionTitle: 'Stream Lifecycle & Lazy Evaluation',
                paragraphs: [
                  'Java Streams represent a sequence of elements supporting sequential and parallel aggregate operations. Streams do not store elements; they carry values from a source through a pipeline of computational steps.',
                  'A critical feature of Streams is Lazy Evaluation: intermediate operations (filter, map, sorted) are not executed until a terminal operation (collect, count, forEach, reduce) is invoked on the pipeline.'
                ],
                codeSnippet: {
                  filename: 'CourseAnalytics.java',
                  language: 'java',
                  code: `import java.util.*;
import java.util.stream.Collectors;

record StudentEnrollment(String studentName, String course, double score) {}

public class CourseAnalytics {
    public static void main(String[] args) {
        List<StudentEnrollment> enrollments = List.of(
            new StudentEnrollment("Aman", "Java", 92.5),
            new StudentEnrollment("Pooja", "Python", 88.0),
            new StudentEnrollment("Rahul", "Java", 95.0),
            new StudentEnrollment("Sneha", "MERN", 91.0),
            new StudentEnrollment("Vikas", "Java", 84.0)
        );

        // Group by course and compute average score
        Map<String, Double> averagePerCourse = enrollments.stream()
            .collect(Collectors.groupingBy(
                StudentEnrollment::course,
                Collectors.averagingDouble(StudentEnrollment::score)
            ));

        // Find top performing Java students with score > 90
        List<String> topJavaStudents = enrollments.stream()
            .filter(e -> "Java".equals(e.course()))
            .filter(e -> e.score() >= 90.0)
            .map(StudentEnrollment::studentName)
            .sorted()
            .toList();

        System.out.println("Averages: " + averagePerCourse);
        System.out.println("Top Java Cadets: " + topJavaStudents);
    }
}`,
                  output: `Averages: {Python=88.0, Java=90.5, MERN=91.0}
Top Java Cadets: [Aman, Rahul]`,
                  explanation: 'Collectors.groupingBy aggregates the stream into a Map keyed by course, while the filter/map pipeline lazily processes only matching elements.'
                },
                proTip: 'In Java 16+, use .toList() instead of .collect(Collectors.toList()) for creating unmodifiable, highly optimized lists.',
                commonMistake: 'Attempting to reuse a stream that has already terminated throws an IllegalStateException: stream has already been operated upon or closed.'
              }
            ],
            quiz: {
              question: 'When do intermediate operations like .filter() and .map() actually execute in a Java Stream?',
              options: [
                'Immediately when declared',
                'Only when a terminal operation like .collect() or .toList() is invoked',
                'During the next garbage collection cycle',
                'When the class file is loaded by the ClassLoader'
              ],
              correctAnswer: 1,
              explanation: 'Intermediate operations are lazy. They construct a pipeline description and only evaluate data when a terminal operation triggers execution.'
            }
          }
        ]
      },
      {
        id: 'mod-3',
        title: 'Module 3: Concurrency, Virtual Threads & Concurrency Utilities',
        description: 'Understand thread lifecycles, race conditions, synchronized locks, ExecutorService, and modern Java 21 Virtual Threads (Project Loom).',
        topics: [
          {
            id: 'java-virtual-threads',
            title: 'Java 21 Virtual Threads & High-Throughput I/O',
            readTime: '15 min read',
            difficulty: 'Advanced',
            summary: 'Explore how Virtual Threads decouple Java threads from OS kernel threads, allowing millions of concurrent tasks with minimal memory footprint.',
            objectives: [
              'Compare Platform (OS) threads vs Virtual Threads (Project Loom)',
              'Understand carrier thread mounting and unmounting during blocking I/O',
              'Build scalable servers with Executors.newVirtualThreadPerTaskExecutor()'
            ],
            sections: [
              {
                sectionTitle: 'Platform Threads vs Virtual Threads',
                paragraphs: [
                  'Traditionally in Java, every java.lang.Thread was a 1:1 wrapper around an operating system kernel thread. An OS thread allocates roughly 1MB of stack memory by default. Consequently, running 5,000 threads consumes gigabytes of RAM and incurs high CPU context-switching costs.',
                  'Java 21 introduces Virtual Threads (JEP 444). A virtual thread is a lightweight thread managed directly by the JVM runtime rather than the OS kernel. When a virtual thread blocks on socket I/O, database queries, or Thread.sleep(), the JVM unmounts it from its underlying Carrier Thread (ForkJoinPool worker) and stores its continuation on the heap.',
                  'When the I/O event finishes, the JVM remounts the continuation onto an available carrier thread to resume execution. This enables applications to handle hundreds of thousands of concurrent requests with negligible overhead.'
                ],
                diagram: {
                  title: 'Carrier Threads vs Virtual Thread Continuations',
                  caption: 'Millions of lightweight virtual threads share a small pool of CPU-bound OS Carrier Threads.',
                  diagramType: 'architecture',
                  svgOrAscii: `[ Virtual Thread 1 ]  [ Virtual Thread 2 ] ... [ Virtual Thread 100,000 ]
             \\                 /
              \\               /  (Mounted when running)
         [ Carrier Thread 1 ]   [ Carrier Thread 2 ]  (ForkJoinPool Workers)
         [ OS Kernel Thread ]   [ OS Kernel Thread ]  (Bound to CPU Cores)`
                },
                codeSnippet: {
                  filename: 'VirtualThreadBenchmark.java',
                  language: 'java',
                  code: `import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.Executors;
import java.util.stream.IntStream;

public class VirtualThreadBenchmark {
    public static void main(String[] args) {
        Instant start = Instant.now();

        // Launches a new lightweight virtual thread per incoming task
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            IntStream.range(0, 10_000).forEach(i -> {
                executor.submit(() -> {
                    // Simulate non-blocking I/O or network call
                    Thread.sleep(Duration.ofMillis(200));
                    return i;
                });
            });
        } // Executor automatically waits for all 10,000 tasks to finish!

        Instant end = Instant.now();
        System.out.println("10,000 concurrent tasks completed in: " + 
            Duration.between(start, end).toMillis() + " ms");
    }
}`,
                  output: `10,000 concurrent tasks completed in: ~230 ms`,
                  explanation: '10,000 blocking tasks completed in just ~230ms! With traditional platform threads, launching 10,000 OS threads would likely throw OutOfMemoryError.'
                },
                proTip: 'Never pool Virtual Threads! Unlike platform threads which are expensive to create, virtual threads are ephemeral and cheap. Create them on demand and let them terminate.',
                commonMistake: 'Pinning carrier threads: If you synchronize around a blocking I/O operation (using synchronized instead of ReentrantLock), the virtual thread cannot unmount from its carrier thread.'
              }
            ],
            quiz: {
              question: 'Why should you NOT pool Virtual Threads with a traditional thread pool?',
              options: [
                'Virtual threads cannot be reused by the JVM',
                'Virtual threads are already cheap to create and are meant to be short-lived per-task',
                'The JVM disables thread pooling in Java 21',
                'Pooling causes carrier threads to crash'
              ],
              correctAnswer: 1,
              explanation: 'Virtual threads have minimal memory footprint and are designed to be created per task and discarded. Pooling them defeats their lightweight design.'
            }
          }
        ]
      }
    ]
  },

  // ==========================================
  // 2. FULL STACK WEB DEVELOPMENT (MERN)
  // ==========================================
  'mern-stack': {
    courseSlug: 'mern-stack',
    courseTitle: 'Full Stack Web Development (MERN)',
    category: 'Full Stack Engineering',
    instructor: 'Sujal Sharma',
    estimatedHours: '45 Hours of Reading & Projects',
    overview: 'Master modern full-stack web applications from MongoDB schema design and Express REST/GraphQL APIs to React 19 concurrent features, Tailwind CSS design systems, and Node.js event-driven architecture.',
    prerequisites: ['HTML/CSS/JS fundamentals', 'Node.js 20+ installed', 'Familiarity with Git'],
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Node.js Architecture & Express REST API Engine',
        description: 'Understand the Node.js Event Loop (Libuv), non-blocking asynchronous I/O, Express routing pipelines, and secure middleware chains.',
        topics: [
          {
            id: 'node-event-loop',
            title: 'Node.js Event Loop & Asynchronous I/O Phases',
            readTime: '13 min read',
            difficulty: 'Intermediate',
            summary: 'Demystify how single-threaded JavaScript handles thousands of network connections using Libuv, Thread Pool, and Event Loop phases.',
            objectives: [
              'Understand the 6 phases of the Libuv Event Loop',
              'Distinguish process.nextTick() microtasks from setImmediate() macrotasks',
              'Avoid event loop blocking with CPU-intensive workloads'
            ],
            sections: [
              {
                sectionTitle: 'The Libuv Event Loop Phases',
                paragraphs: [
                  'Node.js runs JavaScript on a single thread via the Google V8 engine. However, input/output operations (file system, network sockets, DNS) are offloaded to Libuv, a multi-platform C library that interfaces with OS system calls (epoll on Linux, kqueue on macOS, IOCP on Windows).',
                  'The Event Loop continuously cycles through phases: Timers (setTimeout/setInterval) -> Pending Callbacks -> Idle/Prepare -> Poll (I/O events) -> Check (setImmediate) -> Close Callbacks. Microtask queues (Promises and process.nextTick) are drained immediately after every single operation before proceeding to the next phase.'
                ],
                diagram: {
                  title: 'Node.js Event Loop Execution Cycle',
                  caption: 'Microtasks (Promise.then, process.nextTick) execute between every single tick of the event loop.',
                  diagramType: 'architecture',
                  svgOrAscii: `   ┌───────────────────────────┐
┌─>│           TIMERS          │ (setTimeout, setInterval)
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     PENDING CALLBACKS     │ (I/O deferred callbacks)
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │        POLL PHASE         │ (Retrieves new I/O events; blocks if idle)
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           CHECK           │ (setImmediate callbacks execute here)
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │      CLOSE CALLBACKS      │ (e.g. socket.on('close'))
└──┴─────────────┬─────────────┘`
                },
                codeSnippet: {
                  filename: 'eventLoopOrder.js',
                  language: 'javascript',
                  code: `console.log('1: Synchronous code starts');

setTimeout(() => {
  console.log('5: Timers phase (setTimeout 0ms)');
}, 0);

setImmediate(() => {
  console.log('6: Check phase (setImmediate)');
});

Promise.resolve().then(() => {
  console.log('3: Microtask queue (Promise)');
});

process.nextTick(() => {
  console.log('2: High priority Microtask (process.nextTick)');
});

console.log('4: Synchronous code completes');`,
                  output: `1: Synchronous code starts
4: Synchronous code completes
2: High priority Microtask (process.nextTick)
3: Microtask queue (Promise)
5: Timers phase (setTimeout 0ms)
6: Check phase (setImmediate)`,
                  explanation: 'Synchronous code runs first. Then microtasks drain (nextTick has highest precedence, then Promise resolutions). Finally, macrotask phases proceed.'
                },
                proTip: 'Never run heavy synchronous operations like JSON.parse() on 50MB files or complex RegExp in the main thread. Delegate heavy tasks to Worker Threads (worker_threads module).',
                commonMistake: 'Confusing setImmediate() with process.nextTick(). process.nextTick() can starve the I/O event loop if called recursively.'
              }
            ],
            quiz: {
              question: 'Which callback executes first after the current synchronous operation finishes in Node.js?',
              options: [
                'setTimeout(..., 0)',
                'process.nextTick(...)',
                'setImmediate(...)',
                'fs.readFile callback'
              ],
              correctAnswer: 1,
              explanation: 'process.nextTick() callbacks run immediately after the current operation finishes, before any other microtasks or macrotask timer phases.'
            }
          },
          {
            id: 'express-secure-architecture',
            title: 'Express 5 REST API Architecture & JWT Auth Guard',
            readTime: '15 min read',
            difficulty: 'Intermediate',
            summary: 'Architect clean Express controllers, centralized error handling middleware, validation schemas, and JWT cryptographic verification.',
            objectives: [
              'Design modular Express routers with layered separation of concerns',
              'Implement secure JWT authentication and role-based access control',
              'Handle async errors seamlessly with global error-handling middleware'
            ],
            sections: [
              {
                sectionTitle: 'Production REST Structure with Express',
                paragraphs: [
                  'A resilient REST application isolates business logic from HTTP transport layers. In a production Express architecture, Route definitions delegate to Controllers, Controllers interact with Services, and Services query Database Models.',
                  'Authentication relies on stateless JSON Web Tokens (JWT). The client transmits the token in the Authorization: Bearer <token> header. A middleware guard intercepts the request, verifies signature integrity using HMAC SHA-256 or RSA-256, and attaches the decoded user payload to req.user.'
                ],
                codeSnippet: {
                  filename: 'authMiddleware.js',
                  language: 'javascript',
                  code: `import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Expect format: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access Denied: Missing Authentication Token' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or Expired Token' 
      });
    }

    // Attach verified user payload to the request lifecycle
    req.user = decodedUser;
    next();
  });
};

export const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    return res.status(403).json({ 
      success: false, 
      message: \`Forbidden: Requires \${role} privileges\` 
    });
  }
  next();
};`,
                  output: `HTTP 200 on valid token; HTTP 401 when header missing; HTTP 403 on invalid signature`,
                  explanation: 'This middleware intercepts unauthorized requests before they ever reach database or business logic handlers.'
                },
                proTip: 'Always store short-lived JWT access tokens (15-60 mins) and use HTTP-only, secure, SameSite=Strict cookies for refresh tokens to defend against XSS attacks.',
                commonMistake: 'Storing sensitive passwords or secret keys in JWT payload claims. JWT payloads are base64url encoded and can be read by anyone!'
              }
            ],
            quiz: {
              question: 'Why is it dangerous to store sensitive secrets inside a JWT payload?',
              options: [
                'JWT signatures prevent the server from reading claims',
                'JWT payload is only Base64 encoded and can be easily decoded by anyone',
                'JWT tokens expire too quickly to store secrets',
                'Browsers encrypt the payload automatically'
              ],
              correctAnswer: 1,
              explanation: 'JWT payloads are digitally signed, not encrypted. Anyone who has the token can decode the Base64 payload and read its contents.'
            }
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: React 19 Frontend Architecture & State Management',
        description: 'Explore React component lifecycles, hooks deep dive (useEffect, useMemo, useCallback), Context API state patterns, and custom hooks.',
        topics: [
          {
            id: 'react-rendering-lifecycle',
            title: 'React Fiber, Virtual DOM & Reconciliation',
            readTime: '14 min read',
            difficulty: 'Intermediate',
            summary: 'Understand how React Fiber pauses and resumes work, how diffing algorithms compute minimal DOM updates, and how to eliminate unnecessary re-renders.',
            objectives: [
              'Understand the two phases of React: Render Phase vs Commit Phase',
              'Learn the rules of keys in list reconciliation',
              'Master memoization with React.memo, useMemo, and useCallback'
            ],
            sections: [
              {
                sectionTitle: 'The Render Phase vs The Commit Phase',
                paragraphs: [
                  'When state updates in a React application, React executes two distinct phases:',
                  '1. Render Phase: React calls component functions to generate a new Virtual DOM tree of React elements. It compares the new tree against the current fiber tree (Diffing). This phase is purely computational, side-effect free, and can be paused or aborted by React Fiber.',
                  '2. Commit Phase: React applies the calculated mutations to the actual browser DOM (inserting, updating, deleting DOM nodes) and triggers useLayoutEffect and useEffect callbacks.'
                ],
                codeSnippet: {
                  filename: 'OptimizedCourseList.tsx',
                  language: 'typescript',
                  code: `import React, { useState, useMemo, useCallback } from 'react';

interface CourseItem {
  id: number;
  title: string;
  category: string;
  rating: number;
}

export const CourseCatalog: React.FC<{ items: CourseItem[] }> = ({ items }) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Memoize filtered computational result: recalculates ONLY when items, filter or search changes
  const visibleCourses = useMemo(() => {
    return items.filter(c => {
      const matchCat = filter === 'All' || c.category === filter;
      const matchQuery = c.title.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [items, filter, search]);

  // Stable callback reference to avoid re-rendering children
  const handleSelect = useCallback((courseId: number) => {
    console.log('Selected course:', courseId);
  }, []);

  return (
    <div className="p-4 space-y-4">
      <input 
        value={search} 
        onChange={e => setSearch(e.target.value)} 
        placeholder="Filter courses..."
        className="px-3 py-2 border rounded-lg"
      />
      <div className="grid grid-cols-2 gap-3">
        {visibleCourses.map(course => (
          <CourseCard key={course.id} course={course} onSelect={handleSelect} />
        ))}
      </div>
    </div>
  );
};

const CourseCard = React.memo<{ course: CourseItem; onSelect: (id: number) => void }>(
  ({ course, onSelect }) => {
    return (
      <div onClick={() => onSelect(course.id)} className="p-3 border rounded shadow-sm hover:shadow">
        <h4 className="font-bold">{course.title}</h4>
        <span className="text-xs text-blue-600">{course.category}</span>
      </div>
    );
  }
);`,
                  output: `CourseCard only re-renders when its specific course data changes.`,
                  explanation: 'React.memo skips re-rendering CourseCard if props have not changed. useMemo caches heavy filtering, and useCallback ensures function identity remains stable across parent renders.'
                },
                proTip: 'Do not prematurely wrap every single function in useCallback. Measure performance bottlenecks using React DevTools Profiler first.',
                commonMistake: 'Using index as key in dynamic lists that can be reordered or filtered. This breaks React’s component state association and leads to subtle UI rendering bugs.'
              }
            ],
            quiz: {
              question: 'Why should you avoid using array index as a key in dynamic lists?',
              options: [
                'React throws a compile error if index is passed as key',
                'If items are inserted, deleted, or reordered, React confuses DOM node identities and preserves wrong component states',
                'Keys must always be strings, numbers cannot be keys',
                'Array indices slow down the garbage collector'
              ],
              correctAnswer: 1,
              explanation: 'When array indices are keys, reordering or deleting items causes index shifts. React reuses old DOM nodes and internal component state for the wrong items.'
            }
          }
        ]
      }
    ]
  },

  // ==========================================
  // 3. PYTHON FOR DEVELOPERS
  // ==========================================
  'python': {
    courseSlug: 'python',
    courseTitle: 'Python for Developers',
    category: 'Programming & Automation',
    instructor: 'Tanu Priya',
    estimatedHours: '35 Hours of Reading & Exercises',
    overview: 'From Python internal memory model and GIL to generators, decorators, asynchronous programming with asyncio, and modern data manipulation.',
    prerequisites: ['Basic programming logic', 'Python 3.12+ installed'],
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Python Advanced Mechanics & Idiomatic Code',
        description: 'Explore Python memory management, reference counting, mutable vs immutable defaults, decorators, and generators.',
        topics: [
          {
            id: 'python-internals',
            title: 'Memory Management, Namespaces & Mutability',
            readTime: '12 min read',
            difficulty: 'Beginner',
            summary: 'Understand how Python treats variables as name bindings, manages memory through reference counting and cyclic GC, and avoids common mutability bugs.',
            objectives: [
              'Understand how variables in Python are pointers (references) to heap objects',
              'Learn how reference counting and the cyclic Garbage Collector free memory',
              'Identify the dangers of mutable default arguments in functions'
            ],
            sections: [
              {
                sectionTitle: 'Everything is an Object in Python',
                paragraphs: [
                  'In Python, variables are not memory containers that hold raw values. Instead, a variable is simply a name tag bound to a PyObject in heap memory.',
                  'Every PyObject has an ob_refcnt (reference counter) and an ob_type (type pointer). When a reference count drops to 0, Python deallocates the memory immediately. For circular references (Object A references B, and B references A), Python runs a cyclic garbage collector that inspects object generations.'
                ],
                codeSnippet: {
                  filename: 'mutability_demo.py',
                  language: 'python',
                  code: `# DANGEROUS PATTERN: Mutable default argument
def add_student_bad(name: str, cohort: list = []):
    cohort.append(name)
    return cohort

# CORRECT PATTERN: None default with guarded assignment
def add_student_good(name: str, cohort: list | None = None):
    if cohort is None:
        cohort = []
    cohort.append(name)
    return cohort

print("Bad call 1:", add_student_bad("Aman"))
print("Bad call 2:", add_student_bad("Pooja"))  # Contains BOTH Aman and Pooja!

print("Good call 1:", add_student_good("Aman"))
print("Good call 2:", add_student_good("Pooja")) # Clean new list for Pooja`,
                  output: `Bad call 1: ['Aman']
Bad call 2: ['Aman', 'Pooja']
Good call 1: ['Aman']
Good call 2: ['Pooja']`,
                  explanation: 'Default arguments are evaluated once when the function is defined, not every time it is called. Using [] creates a shared list across all function invocations.'
                },
                proTip: 'Always use is for comparison with singletons like None (e.g. if x is None:), not ==. The is keyword compares memory identity (pointer equality), which is faster and immune to overloaded __eq__ methods.',
                commonMistake: 'Modifying a list while iterating over it with a for loop. Use a list comprehension or iterate over a slice copy list[:] instead.'
              }
            ],
            quiz: {
              question: 'When is a default parameter value in a Python function evaluated?',
              options: [
                'Every time the function is called',
                'Only once when the function definition is executed/loaded',
                'When the garbage collector sweeps memory',
                'Only when explicitly passed by the caller'
              ],
              correctAnswer: 1,
              explanation: 'Python evaluates default arguments once at function definition time. This is why mutable defaults retain changes across multiple function calls.'
            }
          }
        ]
      }
    ]
  },

  // ==========================================
  // 4. AUTOCAD & CIVIL 3D INFRASTRUCTURE
  // ==========================================
  'autocad-civil-3d': {
    courseSlug: 'autocad-civil-3d',
    courseTitle: 'AutoCAD & Civil 3D Infrastructure',
    category: 'Civil & Infrastructure Engineering',
    instructor: 'Er. N. K. Verma (AN Survey Consultant)',
    estimatedHours: '40 Hours of Technical Reading & Site Workflows',
    overview: 'Comprehensive non-video drafting & survey engineering curriculum developed in partnership with AN Survey Consultant. Master coordinate systems, Total Station survey point import, contour TIN surface generation, and highway alignments.',
    prerequisites: ['Civil engineering basics', 'Basic AutoCAD familiarity', 'Surveying principles'],
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Survey Data Ingestion & Coordinate Geometry (COGO)',
        description: 'Understand geodetic coordinate reference systems (UTM/WGS84), Total Station raw data formatting, and Point Groups.',
        topics: [
          {
            id: 'civil-cogo-surfaces',
            title: 'Total Station Data Import & TIN Surface Generation',
            readTime: '15 min read',
            difficulty: 'Intermediate',
            summary: 'Learn how to process field survey points (P,E,N,Z,D format), generate Triangular Irregular Networks (TIN), and create accurate elevation contours.',
            objectives: [
              'Parse CSV and PENZD survey point data from Leica/Sokksha Total Stations',
              'Configure Civil 3D Point Styles and Point Label Styles',
              'Generate Triangular Irregular Network (TIN) surfaces from field points',
              'Set contour intervals (Major: 1.0m, Minor: 0.2m) and edit surface boundary breaklines'
            ],
            sections: [
              {
                sectionTitle: 'From Field Survey to Triangular Irregular Networks',
                paragraphs: [
                  'Modern civil infrastructure begins with precise field measurement. Survey crews use Electronic Total Stations and GNSS/RTK receivers to capture 3D coordinate points across existing terrain.',
                  'Raw field points follow standard ASCII conventions, most commonly PENZD format (Point Number, Easting, Northing, Elevation Z, and Description Code, such as CL for Road Centerline, EP for Edge of Pavement, or GL for Ground Level).',
                  'In Autodesk Civil 3D, importing these points allows the software to execute Delaunay Triangulation, building a Triangular Irregular Network (TIN) surface. A TIN surface models the continuous 3D topography by connecting adjacent points into non-overlapping triangles without crossing breaklines.'
                ],
                diagram: {
                  title: 'Delaunay Triangulation & Breaklines in TIN Surface',
                  caption: 'Breaklines force triangle edges along natural elevation lines such as road crowns, retaining walls, or stream banks.',
                  diagramType: 'architecture',
                  svgOrAscii: `  Point A (102.5m)
        /\\
       /  \\   <-- Triangle 1
      /    \\
Point B --- Point C (101.8m)
      \\    /
       \\  /   <-- Triangle 2 (Delaunay Circle Property)
        \\/
  Point D (100.2m)`
                },
                codeSnippet: {
                  filename: 'survey_points_sample.csv',
                  language: 'csv',
                  code: `PointNumber,Easting,Northing,Elevation,Description
101,245890.342,2841920.118,52.340,BM_STATS_01
102,245902.115,2841935.450,52.410,ROAD_CL
103,245898.670,2841932.890,52.120,EP_L
104,245905.880,2841938.120,52.150,EP_R
105,245920.440,2841952.780,52.620,ROAD_CL
106,245917.020,2841950.110,52.310,EP_L
107,245924.150,2841955.330,52.330,EP_R`,
                  output: `Valid PENZD format recognized by Autodesk Civil 3D Point Import Engine`,
                  explanation: 'Civil 3D parses this coordinate data directly to generate 3D COGO points with descriptive tags automatically routed to designated layers.'
                },
                proTip: 'Always verify your drawing project coordinate system (e.g. UTM WGS84 Zone 44N or Zone 45N for India) BEFORE importing survey points to prevent disastrous project scale distortions.',
                commonMistake: 'Swapping Northing and Easting columns during point file import. If swapped, your entire survey surface will be rotated 90 degrees and placed thousands of kilometers away from its real geospatial location.'
              }
            ],
            quiz: {
              question: 'In survey data formatting, what does the standard acronym "PENZD" represent?',
              options: [
                'Project, Elevation, Northing, Zero, Direction',
                'Point Number, Easting, Northing, Elevation (Z), Description Code',
                'Plane, Edge, Node, Zone, Degree',
                'Polygon, Earth-Radius, Normal, Zenith, Datum'
              ],
              correctAnswer: 1,
              explanation: 'PENZD stands for Point Number, Easting (X), Northing (Y), Elevation (Z), and Description Code.'
            }
          }
        ]
      }
    ]
  }
};

/**
 * Fallback generator for courses that don't have hand-curated curriculum yet.
 * Ensures EVERY course on the platform has a rich, multi-module reading classroom!
 */
export function getCourseCurriculum(slug: string, courseTitle?: string, tech?: string): CourseLearningCurriculum {
  if (COURSE_CURRICULA[slug]) {
    return COURSE_CURRICULA[slug];
  }

  const title = courseTitle || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const technology = tech || title;

  return {
    courseSlug: slug,
    courseTitle: title,
    category: 'Engineering & Technology',
    instructor: 'STATS Senior Faculty',
    estimatedHours: '32 Hours of In-Depth Reading & Practice',
    overview: `Comprehensive, non-video technical syllabus covering fundamental to advanced architecture in ${title}. Master core theory, industry design patterns, live code walkthroughs, and real-world debugging.`,
    prerequisites: ['Basic understanding of programming / engineering concepts', 'Development environment installed', 'Commitment to daily reading and code practice'],
    modules: [
      {
        id: 'mod-1',
        title: `Module 1: Foundations & Architecture of ${title}`,
        description: `Establish bedrock conceptual knowledge, runtime environments, core syntax, and configuration standards for ${technology}.`,
        topics: [
          {
            id: `${slug}-foundations`,
            title: `Core Fundamentals & Engineering Architecture`,
            readTime: '10 min read',
            difficulty: 'Beginner',
            summary: `Understand how ${technology} operates at a low level, memory structures, and fundamental building blocks.`,
            objectives: [
              `Understand the core paradigm and syntax of ${technology}`,
              'Configure production-grade development tooling and linting',
              'Trace request/data execution lifecycles',
              'Apply modern clean architecture conventions'
            ],
            sections: [
              {
                sectionTitle: `Engineering Overview of ${technology}`,
                paragraphs: [
                  `${technology} is widely utilized across modern enterprise systems for its high performance, robust ecosystem, and maintainability.`,
                  'When architecting applications using this stack, developers must prioritize modularity, separation of concerns, and clean dependency management.'
                ],
                diagram: {
                  title: `${technology} Architectural Pipeline`,
                  caption: 'High-level component breakdown and data flow diagram.',
                  diagramType: 'architecture',
                  svgOrAscii: `[ User Interface / Client ]
            │
            ▼ (HTTP / Protocol)
[ ${technology} Core Engine ] ───► [ Service / Business Logic ]
                                      │
                                      ▼
                               [ Data Store / DB ]`
                },
                codeSnippet: {
                  filename: `ApplicationCore.${slug.includes('python') ? 'py' : slug.includes('java') ? 'java' : 'ts'}`,
                  language: slug.includes('python') ? 'python' : slug.includes('java') ? 'java' : 'typescript',
                  code: `// STATS INNOTECH Certified Code Example: ${technology}
export class EngineService {
  private status: string = 'INITIALIZED';

  public executeTask(taskId: string): Record<string, any> {
    console.log(\`[Engine] Processing Task: \${taskId}\`);
    return {
      taskId,
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
      platform: 'STATS INNOTECH LMS'
    };
  }
}`,
                  output: `[Engine] Processing Task: STATS-TASK-001 -> SUCCESS`,
                  explanation: `This modular class illustrates clean dependency injection and task dispatching standards in ${technology}.`
                },
                proTip: 'Always write modular code with unit tests from day one to maintain code quality as your project scales.',
                commonMistake: 'Hardcoding environment configuration values directly into source code. Always use environment variables.'
              }
            ],
            quiz: {
              question: `What is the primary best practice when structuring applications in ${technology}?`,
              options: [
                'Keep all application code inside a single large file',
                'Isolate business logic from transport and storage layers with separation of concerns',
                'Hardcode all database credentials in git',
                'Never write tests to maximize delivery speed'
              ],
              correctAnswer: 1,
              explanation: 'Separation of concerns allows code to be tested, scaled, and maintained independently without unintended side effects.'
            }
          },
          {
            id: `${slug}-data-structures`,
            title: `Data Flow & State Management Patterns`,
            readTime: '12 min read',
            difficulty: 'Intermediate',
            summary: `Explore how data moves through components, caching strategies, and defensive programming in ${technology}.`,
            objectives: [
              'Design normalized, efficient data models',
              'Implement validation guards and error handling',
              'Optimize memory usage and network serialization'
            ],
            sections: [
              {
                sectionTitle: 'Defensive Data Handling & Validation',
                paragraphs: [
                  'Production systems must treat all external inputs as potentially invalid or malicious. Implementing strict boundary validation ensures data integrity.',
                  'By enforcing immutability where appropriate and structuring clean data pipelines, developers avoid race conditions and unpredictable state mutations.'
                ],
                proTip: 'Validate data at the outer boundary (controllers / API inputs) before passing it deep into business logic.',
                commonMistake: 'Failing to handle edge cases like null/undefined or network timeouts.'
              }
            ],
            quiz: {
              question: 'Where is the most effective place to validate external data in an application?',
              options: [
                'Directly inside the database trigger',
                'At the entry boundary before executing business logic',
                'Only on the client-side user interface',
                'Validation is unnecessary if using modern frameworks'
              ],
              correctAnswer: 1,
              explanation: 'Validating data at the entry boundary ensures invalid payloads are rejected immediately, protecting core business services.'
            }
          }
        ]
      },
      {
        id: 'mod-2',
        title: `Module 2: Advanced Design Patterns & Production Workflows`,
        description: `Explore enterprise design patterns, async orchestration, security hardening, and performance benchmarking for ${technology}.`,
        topics: [
          {
            id: `${slug}-production-patterns`,
            title: `Design Patterns, Security & Performance Tuning`,
            readTime: '15 min read',
            difficulty: 'Advanced',
            summary: `Master design patterns like Factory, Repository, and Observer, combined with performance profiling and security best practices.`,
            objectives: [
              'Implement clean architectural design patterns',
              'Harden endpoints and data layers against common vulnerabilities',
              'Profile bottlenecks and tune execution efficiency'
            ],
            sections: [
              {
                sectionTitle: 'Production Deployment & Resiliency',
                paragraphs: [
                  'Writing functional code is only the first step. Making an application production-ready requires monitoring, automated logging, graceful degradation, and resilience.',
                  'Implement retry policies with exponential backoff for network operations, and utilize circuit breaker patterns when interacting with third-party microservices.'
                ],
                proTip: 'Always log structured JSON with correlation IDs (trace IDs) so distributed operations can be tracked across microservice boundaries.',
                commonMistake: 'Catching generic exceptions silently and swallowing the error stack trace.'
              }
            ],
            quiz: {
              question: 'What is the purpose of correlation IDs (trace IDs) in production systems?',
              options: [
                'To encrypt user passwords in transit',
                'To track a single user request across distributed services and log files',
                'To automatically restart crashed servers',
                'To eliminate all garbage collection pauses'
              ],
              correctAnswer: 1,
              explanation: 'Correlation IDs enable engineers to trace a request through multiple services and inspect the exact sequence of log messages.'
            }
          }
        ]
      }
    ]
  };
}
