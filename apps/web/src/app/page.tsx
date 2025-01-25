'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { User } from '@supabase/auth-helpers-nextjs'

export default function LandingPage() {
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<User | null>(null)
  const [ticketForm, setTicketForm] = useState({
    email: '',
    subject: '',
    description: ''
  })

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase.auth])

  const handleTicketSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle ticket submission
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">KubeFlow Support</h1>
            <nav className="hidden md:flex space-x-6">
              <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</Link>
              <Link href="/tickets" className="text-muted-foreground hover:text-foreground transition-colors">My Tickets</Link>
              <Link href="/status" className="text-muted-foreground hover:text-foreground transition-colors">System Status</Link>
            </nav>
          </div>
          <div>
            {user ? (
              <Button variant="ghost" onClick={() => supabase.auth.signOut()} className="hover:bg-blue-50">Sign Out</Button>
            ) : (
              <Link href="/login">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">
              How can we help you today?
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              Search our knowledge base or browse popular topics below
            </p>
            <div className="max-w-2xl mx-auto">
              <Input
                type="search"
                placeholder="Search for answers..."
                className="w-full h-14 px-6 text-lg border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        {/* Quick Links Grid */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="mb-12">
              <div className="inline-block bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg px-4 py-2 mb-4">
                <h2 className="text-sm font-semibold tracking-wide uppercase text-blue-600">Popular Topics</h2>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">
                Browse our most helpful resources
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Getting Started */}
              <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <CardTitle className="text-xl font-semibold">Getting Started</CardTitle>
                  </div>
                  <CardDescription className="text-base text-gray-600">New to our platform? Start here</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/docs/quickstart" className="text-blue-600 hover:underline flex items-center group">
                        Quick Start Guide <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/docs/installation" className="text-blue-600 hover:underline flex items-center group">
                        Installation Guide <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/docs/architecture" className="text-blue-600 hover:underline flex items-center group">
                        Architecture Overview <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Troubleshooting */}
              <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <CardTitle className="text-xl font-semibold">Troubleshooting</CardTitle>
                  </div>
                  <CardDescription className="text-base text-gray-600">Common issues and solutions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/docs/common-errors" className="text-blue-600 hover:underline flex items-center group">
                        Common Issues <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/docs/performance" className="text-blue-600 hover:underline flex items-center group">
                        Performance Issues <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/docs/networking" className="text-blue-600 hover:underline flex items-center group">
                        Network Troubleshooting <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Documentation */}
              <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-cyan-50 rounded-lg">
                      <svg className="h-5 w-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <CardTitle className="text-xl font-semibold">Documentation</CardTitle>
                  </div>
                  <CardDescription className="text-base text-gray-600">Detailed guides and references</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/docs" className="text-blue-600 hover:underline flex items-center group">
                        API Reference <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/docs/cli" className="text-blue-600 hover:underline flex items-center group">
                        CLI Documentation <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/docs/sdk" className="text-blue-600 hover:underline flex items-center group">
                        SDK Guides <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Support Section */}
        <section className="py-16 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <div className="inline-block bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 mb-4">
              <h2 className="text-sm font-semibold tracking-wide uppercase text-blue-600">Need Help?</h2>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Can&apos;t find what you&apos;re looking for?
            </h3>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Our support team is here to help you with any questions or issues you might have.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-200 px-8 py-6 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold text-lg">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Contact Support
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Submit Support Request</DialogTitle>
                  <DialogDescription className="text-base text-gray-600">
                    Fill out the form below and we&apos;ll get back to you as soon as possible.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleTicketSubmit} className="space-y-4 mt-4">
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={ticketForm.email}
                      onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="Brief description of your issue"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <Textarea
                      id="description"
                      placeholder="Please provide as much detail as possible..."
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-lg min-h-[100px] focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-medium"
                  >
                    Submit Request
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </section>
      </main>

      <footer className="border-t bg-gray-50 mt-12">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-12 md:grid-cols-4">
            <div>
              <h3 className="font-semibold mb-4 text-gray-900">Documentation</h3>
              <ul className="space-y-3">
                <li><Link href="/docs" className="text-gray-600 hover:text-blue-600 transition-colors">API Reference</Link></li>
                <li><Link href="/docs/cli" className="text-gray-600 hover:text-blue-600 transition-colors">CLI Documentation</Link></li>
                <li><Link href="/docs/sdk" className="text-gray-600 hover:text-blue-600 transition-colors">SDK Guides</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-900">Support</h3>
              <ul className="space-y-3">
                <li><Link href="/tickets" className="text-gray-600 hover:text-blue-600 transition-colors">Support Tickets</Link></li>
                <li><Link href="/status" className="text-gray-600 hover:text-blue-600 transition-colors">System Status</Link></li>
                <li><Link href="/sla" className="text-gray-600 hover:text-blue-600 transition-colors">SLA</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-900">Community</h3>
              <ul className="space-y-3">
                <li><Link href="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">Blog</Link></li>
                <li><a href="https://github.com/kubeflow" className="text-gray-600 hover:text-blue-600 transition-colors">GitHub</a></li>
                <li><a href="https://twitter.com/kubeflow" className="text-gray-600 hover:text-blue-600 transition-colors">Twitter</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-900">Company</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="text-gray-600 hover:text-blue-600 transition-colors">Careers</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>&copy; 2025 KubeFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
