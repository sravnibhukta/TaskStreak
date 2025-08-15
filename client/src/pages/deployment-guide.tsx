import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  Copy, 
  ExternalLink, 
  Zap, 
  Database, 
  Globe, 
  AlertTriangle,
  Terminal,
  GitBranch,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DeploymentGuide() {
  const { toast } = useToast();
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the text manually",
        variant: "destructive",
      });
    }
  };

  const vercelConfig = `{
  "version": 2,
  "builds": [
    {
      "src": "client/**/*",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "../dist/public"
      }
    },
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}`;

  const packageScripts = `{
  "scripts": {
    "build": "vite build",
    "start": "node dist/index.js",
    "build-server": "esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "vercel-build": "npm run build && npm run build-server"
  }
}`;

  const deployCommands = `# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel

# Follow the prompts:
# ? Set up and deploy "~/taskstreak"? [Y/n] y
# ? Which scope do you want to deploy to? Your Name
# ? Link to existing project? [y/N] n
# ? What's your project's name? taskstreak
# ? In which directory is your code located? ./`;

  const migrationCommands = `# Install dependencies
npm install

# Set your DATABASE_URL
export DATABASE_URL="postgresql://..."

# Run migrations
npm run db:push

# Or using Drizzle Kit directly
npx drizzle-kit push`;

  const platforms = [
    {
      name: "Vercel",
      icon: "V",
      color: "bg-blue-600",
      description: "Serverless deployment with excellent React support",
      pros: ["Zero config deployment", "Automatic HTTPS", "Global CDN", "Preview deployments"],
      cons: ["Serverless function limitations", "Cold starts"],
      difficulty: "Easy",
      recommended: true
    },
    {
      name: "Railway",
      icon: "R",
      color: "bg-purple-600",
      description: "Full-stack deployment with built-in PostgreSQL",
      pros: ["Built-in database", "Simple configuration", "Auto-deployments", "No cold starts"],
      cons: ["Limited free tier", "Newer platform"],
      difficulty: "Easy"
    },
    {
      name: "Render",
      icon: "R",
      color: "bg-indigo-600",
      description: "Deploy web services and databases",
      pros: ["Free tier available", "Managed PostgreSQL", "Git-based deployments"],
      cons: ["Slower cold starts on free tier", "Limited regions"],
      difficulty: "Medium"
    },
    {
      name: "DigitalOcean",
      icon: "DO",
      color: "bg-blue-500",
      description: "App Platform with managed databases",
      pros: ["Predictable pricing", "Managed databases", "Global CDN"],
      cons: ["More complex setup", "Higher cost"],
      difficulty: "Medium"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TS</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">TaskStreak</h1>
                <p className="text-sm text-gray-600">Deployment Guide</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Ready for Production
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="sticky top-24 space-y-1">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-900">Deployment Steps</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {[
                      { id: "overview", label: "Overview", active: true },
                      { id: "prerequisites", label: "Prerequisites" },
                      { id: "configuration", label: "Configuration" },
                      { id: "database", label: "Database Setup" },
                      { id: "deployment", label: "Deploy to Vercel" },
                      { id: "alternatives", label: "Other Platforms" }
                    ].map((item) => (
                      <li key={item.id}>
                        <a 
                          href={`#${item.id}`}
                          className={`flex items-center text-sm hover:text-blue-600 ${
                            item.active ? 'text-blue-600 font-medium' : 'text-gray-600'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full mr-3 ${
                            item.active ? 'bg-blue-600' : 'bg-gray-300'
                          }`}></span>
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overview */}
            <Card id="overview">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle>Deployment Overview</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Deploy your TaskStreak application to production platforms with these step-by-step guides. 
                  Your app is a full-stack React + Express application with PostgreSQL database.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Frontend</h4>
                    <p className="text-sm text-gray-600">React 18 with TypeScript, Vite build system</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Backend</h4>
                    <p className="text-sm text-gray-600">Express.js API with serverless functions</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Database</h4>
                    <p className="text-sm text-gray-600">PostgreSQL with Drizzle ORM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prerequisites */}
            <Card id="prerequisites">
              <CardHeader>
                <CardTitle>Prerequisites</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Node.js & npm",
                      description: "Node.js 18+ and npm installed locally",
                      completed: true
                    },
                    {
                      title: "Git Repository",
                      description: "Code pushed to GitHub, GitLab, or Bitbucket",
                      completed: true
                    },
                    {
                      title: "Platform Account",
                      description: "Vercel, Railway, or other deployment platform account",
                      completed: false
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                        item.completed ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <CheckCircle className={`w-4 h-4 ${
                          item.completed ? 'text-green-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Configuration */}
            <Card id="configuration">
              <CardHeader>
                <CardTitle>Required Configuration Files</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="vercel" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="vercel">vercel.json</TabsTrigger>
                    <TabsTrigger value="package">package.json</TabsTrigger>
                    <TabsTrigger value="env">Environment</TabsTrigger>
                  </TabsList>

                  <TabsContent value="vercel" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Create vercel.json</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(vercelConfig, "Vercel config")}
                        data-testid="button-copy-vercel-config"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        {copiedText === "Vercel config" ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">Add this configuration file to your project root:</p>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-gray-100 text-sm">
                        <code>{vercelConfig}</code>
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="package" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Update package.json Scripts</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(packageScripts, "Package scripts")}
                        data-testid="button-copy-package-scripts"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        {copiedText === "Package scripts" ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">Add these scripts to your package.json:</p>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-gray-100 text-sm">
                        <code>{packageScripts}</code>
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="env" className="space-y-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Required Environment Variables</strong><br />
                        You'll need to set these in your deployment platform:
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-2">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <code className="text-sm font-mono text-gray-800">DATABASE_URL=postgresql://...</code>
                        <p className="text-xs text-gray-600 mt-1">PostgreSQL connection string</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <code className="text-sm font-mono text-gray-800">NODE_ENV=production</code>
                        <p className="text-xs text-gray-600 mt-1">Production environment flag</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Database Setup */}
            <Card id="database">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Database className="w-5 h-5 text-blue-600" />
                  <CardTitle>Database Setup</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <Card className="border-green-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xs">N</span>
                        </div>
                        <CardTitle className="text-base">Neon Database (Recommended)</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                        <li>Visit <a href="https://neon.tech" className="text-blue-600 hover:underline" data-testid="link-neon">neon.tech</a></li>
                        <li>Create a new project</li>
                        <li>Copy the connection string</li>
                        <li>Run database migrations</li>
                      </ol>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xs">S</span>
                        </div>
                        <CardTitle className="text-base">Supabase Alternative</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                        <li>Visit <a href="https://supabase.com" className="text-blue-600 hover:underline" data-testid="link-supabase">supabase.com</a></li>
                        <li>Create new project</li>
                        <li>Get PostgreSQL URL</li>
                        <li>Configure connection</li>
                      </ol>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Run Database Migrations</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(migrationCommands, "Migration commands")}
                      data-testid="button-copy-migration-commands"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copiedText === "Migration commands" ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-gray-100 text-sm">
                      <code>{migrationCommands}</code>
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deployment */}
            <Card id="deployment">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <CardTitle>Deploy to Vercel</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="cli" className="space-y-6">
                  <TabsList>
                    <TabsTrigger value="cli">Vercel CLI</TabsTrigger>
                    <TabsTrigger value="github">GitHub Integration</TabsTrigger>
                  </TabsList>

                  <TabsContent value="cli" className="space-y-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">Recommended</Badge>
                      <h3 className="text-lg font-medium">Using Vercel CLI</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Install and deploy with a single command:</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(deployCommands, "Deploy commands")}
                        data-testid="button-copy-deploy-commands"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        {copiedText === "Deploy commands" ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-gray-100 text-sm">
                        <code>{deployCommands}</code>
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="github" className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <GitBranch className="w-5 h-5 mr-2" />
                      Using GitHub Integration
                    </h3>
                    <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside ml-6">
                      <li>Push your code to GitHub</li>
                      <li>Visit <a href="https://vercel.com" className="text-blue-600 hover:underline" data-testid="link-vercel">vercel.com</a> and login</li>
                      <li>Click "New Project"</li>
                      <li>Import your GitHub repository</li>
                      <li>Configure build settings (auto-detected)</li>
                      <li>Add environment variables</li>
                      <li>Deploy!</li>
                    </ol>
                  </TabsContent>
                </Tabs>

                <Alert className="mt-6">
                  <Settings className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Setting Environment Variables</strong><br />
                    In Vercel Dashboard: Go to Project Settings → Environment Variables and add your DATABASE_URL and NODE_ENV variables.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Alternative Platforms */}
            <Card id="alternatives">
              <CardHeader>
                <CardTitle>Alternative Deployment Platforms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {platforms.map((platform, index) => (
                    <Card key={index} className={`relative ${platform.recommended ? 'border-blue-200' : ''}`}>
                      {platform.recommended && (
                        <Badge 
                          variant="secondary" 
                          className="absolute -top-2 -right-2 bg-blue-100 text-blue-800 border-blue-200"
                        >
                          Recommended
                        </Badge>
                      )}
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${platform.color} rounded-lg flex items-center justify-center`}>
                            <span className="text-white font-bold text-xs">{platform.icon}</span>
                          </div>
                          <div>
                            <CardTitle className="text-base">{platform.name}</CardTitle>
                            <Badge variant="outline" className="text-xs mt-1">
                              {platform.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3">{platform.description}</p>
                        <div className="space-y-2">
                          {platform.pros.slice(0, 3).map((pro, i) => (
                            <div key={i} className="flex items-center text-sm text-green-600">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {pro}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Start Summary */}
            <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <CardHeader>
                <CardTitle className="text-white">Quick Start Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Fastest Deploy (Vercel)</h3>
                    <div className="bg-white bg-opacity-10 rounded-lg p-4 font-mono text-sm space-y-1">
                      <div># 1. Install CLI</div>
                      <div>npm i -g vercel</div>
                      <div></div>
                      <div># 2. Deploy</div>
                      <div>vercel</div>
                      <div></div>
                      <div># 3. Set DATABASE_URL</div>
                      <div># in Vercel dashboard</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-3">Don't Forget</h3>
                    <ul className="space-y-2 text-sm">
                      {[
                        "Add vercel.json configuration",
                        "Set up PostgreSQL database",
                        "Configure environment variables",
                        "Run database migrations"
                      ].map((item, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Need help? Check the documentation for your specific deployment platform or{" "}
              <a href="#" className="text-blue-600 hover:underline" data-testid="link-contact-support">contact support</a>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
