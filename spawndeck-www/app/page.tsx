import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Spawndeck
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Manage multiple Claude Code instances in parallel using Git worktrees.
              Work on different features simultaneously without conflicts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://github.com/spawndeck/spawndeck"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-700 text-base font-medium rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Spawndeck?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              When working with Claude Code on complex projects, you need the right tools
              to manage parallel development efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-700">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Parallel Development</h3>
              <p className="text-gray-400">
                Run multiple Claude Code instances simultaneously on different branches
                without context switching.
              </p>
            </div>

            <div className="bg-gray-900 rounded-lg p-8 border border-gray-700">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🌳</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Git Worktree Management</h3>
              <p className="text-gray-400">
                Create, switch, and manage worktrees with intuitive commands and
                automatic branch validation.
              </p>
            </div>

            <div className="bg-gray-900 rounded-lg p-8 border border-gray-700">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Seamless Integration</h3>
              <p className="text-gray-400">
                Works perfectly with Claude Code, VS Code, and other editors.
                Launch your preferred editor instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Get Started in Seconds
            </h2>
            <p className="text-xl text-gray-400">
              Install Spawndeck globally and start managing your worktrees
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Install via npm</h3>
                <div className="bg-gray-900 rounded p-4 font-mono text-sm">
                  npm install -g spawndeck-cli
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Create a new worktree</h3>
                <div className="bg-gray-900 rounded p-4 font-mono text-sm">
                  spawndeck feature-branch-name
                  <br />
                  # or use the shorthand
                  <br />
                  sd feature-branch-name
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">List worktrees</h3>
                <div className="bg-gray-900 rounded p-4 font-mono text-sm">
                  spawndeck --list
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Streamline Your Development?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join developers who are already using Spawndeck to manage multiple
            Claude Code instances efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://www.npmjs.com/package/spawndeck-cli"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              View on npm
            </Link>
            <Link
              href="https://github.com/spawndeck/spawndeck"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-600 text-base font-medium rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
            >
              GitHub Repository
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>© 2024 Spawndeck. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}