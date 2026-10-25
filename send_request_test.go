package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestSendRequest(t *testing.T) {
	t.Run("Should return an error, that HTTP request could not be created", func(t *testing.T) {
		testServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			if req.Method != http.MethodGet {
				t.Errorf("Expected GET request, got - %s", req.Method)
			}
			w.WriteHeader(http.StatusOK)
			_, _ = w.Write([]byte("response body"))
		}))
		defer testServer.Close()

		_, err := SendRequest("12345678", "")
		if err == nil {
			t.Errorf("Error should have been returned")
		}
	})

	t.Run("Should return an error if server returns nor 200, nor 404", func(t *testing.T) {
		testServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			if req.Method != http.MethodGet {
				t.Errorf("Expected GET request, got - %s", req.Method)
			}
			w.WriteHeader(http.StatusUnauthorized)
			_, _ = w.Write([]byte("response body"))
		}))
		defer testServer.Close()

		_, err := SendRequest(testServer.URL, "")
		if err == nil {
			t.Errorf("Error should have been returned")
		}
	})

	t.Run("Should return an error if server returns 404", func(t *testing.T) {
		testServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			if req.Method != http.MethodGet {
				t.Errorf("Expected GET request, got - %s", req.Method)
			}
			w.WriteHeader(http.StatusNotFound)
			_, _ = w.Write([]byte("response body"))
		}))
		defer testServer.Close()

		_, err := SendRequest(testServer.URL, "")
		if err == nil {
			t.Errorf("Error should have been returned")
		}
	})

	t.Run("Should return an error if server returns 404", func(t *testing.T) {
		testServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			if req.Method != http.MethodGet {
				t.Errorf("Expected GET request, got - %s", req.Method)
			}
			w.WriteHeader(http.StatusOK)
			_, _ = w.Write([]byte("response body"))
		}))
		defer testServer.Close()

		_, err := SendRequest(testServer.URL, "golang")
		if err != nil {
			t.Errorf("Error should not have been returned - %s", err)
		}
	})

}
